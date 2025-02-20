import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Midea } from '@models/midea';
import { MideaService } from '@services/midea.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogMideaComponent } from '@shared/dialogs/dialog-midea/dialog-midea.component';
import { DialogShowCommentsComponent } from '@shared/dialogs/dialog-show-comments/dialog-show-comments.component';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, finalize } from 'rxjs';

@Component({
  selector: 'app-mideas',
  templateUrl: './mideas.component.html',
  styleUrl: './mideas.component.scss'
})
export class MideasComponent implements OnInit{

  service_id: number;
  loading: boolean = false;
  mideas: Midea[];
  form: FormGroup;

  constructor(
    private _route: ActivatedRoute,
    private _mideaService: MideaService,
    private readonly _matDialog: MatDialog,
    private readonly _dialog: MatDialog,
    private readonly _toarstr: ToastrService,
    private readonly _fb: FormBuilder,
  ){}

  ngOnInit() {
    this.form = this._fb.group({
      search_term: [''],
      order_by: [''],
      order: ['']
    });

    this._route.params.subscribe(params => {
      this.service_id = params['id'];
      this.getMidea();
    });

    this.form.valueChanges
      .pipe(debounceTime(200))    
      .subscribe(() => {
        this.getMidea();
      });
  }

  getMidea(){
    this._mideaService
    .search({}, {
      service_id : this.service_id,
      search_term: this.form.get('search_term').value,
      order_by: this.form.get('order_by').value,
      order: this.form.get('order').value
    })
    .subscribe({
      next: res => {
        this.mideas = res.data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  openMideaDialog(midea?: any): void {
    const dialogConfig = new MatDialogConfig();

    const data = {
      service_id: this.service_id,
      midea      
    }
      
    dialogConfig.data = data || {};
      
    dialogConfig.width = '600px';
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
      
    this._matDialog
      .open(DialogMideaComponent, dialogConfig)
      .afterClosed()
      .subscribe((midea) => {
        if (midea) {
          if(midea.get('id')){
            this.updateMidea(midea.get('id'), midea);
          }else{
            this.createMidea(midea);
          }
        }
      });
  }

  createMidea(media: FormData) {
    this.loading = true;
  
    // Extrai os arquivos do FormData
    const files: File[] = [];
    media.forEach((value, key) => {
      if (key.startsWith("mideas[")) {
        files.push(value as File);
      }
    });
  
    // Divide os arquivos em grupos de 3
    const batchSize = 3;
    const batches = this.chunkArray(files, batchSize);
  
    // Função assíncrona para enviar cada lote separadamente
    const uploadBatch = async () => {
      for (const batch of batches) {
        const formData = new FormData();
  
        // Adiciona os demais campos do formulário
        media.forEach((value, key) => {
          if (!key.startsWith("mideas[")) {
            formData.append(key, value);
          }
        });
  
        // Adiciona os arquivos do lote atual
        batch.forEach((file, index) => {
          formData.append(`mideas[${index}]`, file);
        });
  
        try {
          await this._mideaService.create(formData).toPromise();
          this._toarstr.success(`Enviado ${batch.length} arquivos com sucesso!`);
        } catch (error) {
          this._toarstr.error('Erro ao enviar arquivos.');
          console.error(error);
          break; // Para o processo caso ocorra erro
        }
      }
      this.loading = false;
      this.getMidea(); // Atualiza a lista de mídias
    };
  
    uploadBatch();
  }
  
  /**
   * Divide um array em grupos menores
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }
  
  
  updateMidea(id: number, media: FormData){
    this._mideaService
    .update(id, media)
    .subscribe({
      next: res => {
        this.getMidea();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.error('Error:', error);
      }
    })
  }

  isImage(path: string): boolean {
    return /\.(jpg|jpeg|png|gif|raw)$/i.test(path);
  }
  
  isVideo(path: string): boolean {
    return /\.(mov|mp4)$/i.test(path);
  }
  
  isAudio(path: string): boolean {
    return /\.(wav|mp3)$/i.test(path);
  }

  onDelete(midea_id){
    this._dialog.open(DialogConfirmComponent)
    .afterClosed()
    .subscribe((res) => {
      if(res){
        this.delete(midea_id);
      }
    });
  }

  delete(midea_id){
    this.loading = true;
    this._mideaService.delete(midea_id)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (res) => {
        this.mideas = this.mideas.filter(m => m.id!== midea_id);        
        this._toarstr.success(res.message);
      },
      error: (error) => {        
        this._toarstr.error(error.error.message);
      }
    })

  }

  downloadFiles() {
    const code = this.service_id;
  
    this._mideaService.download(code)
    .subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mideas-${new Date().toISOString()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao baixar arquivos:', error);
      }
    });
  }

  download(midea_id: number): void {
    this._mideaService.downloadOne(midea_id)
      .subscribe({
        next: (response: Blob) => {
          // Determina o tipo do arquivo a partir do Blob
          const contentType = response.type || 'application/octet-stream';
          const blob = new Blob([response], { type: contentType });
  
          // Extrai o nome do arquivo da URL
          const fileName = `file-${new Date().toISOString()}`;
  
          // Cria um link temporário para download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
  
          // Libera o URL temporário
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Erro ao baixar arquivos:', error);
        }
      });
  }
  
  
  openCommentsDialog(comments: any): void {
    this._dialog.
    open(DialogShowCommentsComponent, {
      width: '600px',
      data: comments 
    });
  }
}
