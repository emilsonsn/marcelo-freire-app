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

  parentId: number = null;
  parentStack: number[] = [];

  draggedMidea: Midea = null;

  selectedMideas: Set<number> = new Set();
  lastSelectedIndex: number = null;

  viewMode: 'grid' | 'list' = 'grid';

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
    this.loading = true;

    this._mideaService
    .search({}, {
      service_id : this.service_id,
      parent_id: this.parentId,
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

  enterFolder(midea: Midea): void {
    this.parentStack.push(this.parentId);
    this.parentId = midea.id;
    this.getMidea();
  }

  goBack(): void {
    if (this.parentStack.length) {
      this.parentId = this.parentStack.pop();
      this.getMidea();
    }
  }

  openMideaDialog(midea?: any): void {
    const dialogConfig = new MatDialogConfig();

    const data = {
      service_id: this.service_id,
      parent_id: this.parentId,
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

    const type = media.get('type');
    const isFolder = type === 'folder';

    if (isFolder) {
      this._mideaService.create(media).subscribe({
        next: () => {
          this._toarstr.success('Pasta criada com sucesso!');
          this.loading = false;
          this.getMidea();
        },
        error: () => {
          this._toarstr.error('Erro ao criar pasta.');
          this.loading = false;
        }
      });
      return;
    }

    const files: File[] = [];
    media.forEach((value, key) => {
      if (key.startsWith("mideas[")) {
        files.push(value as File);
      }
    });

    const batchSize = 3;
    const batches = this.chunkArray(files, batchSize);

    const uploadBatch = async () => {
      for (const batch of batches) {
        const formData = new FormData();

        media.forEach((value, key) => {
          if (!key.startsWith("mideas[")) {
            formData.append(key, value);
          }
        });

        batch.forEach((file, index) => {
          formData.append(`mideas[${index}]`, file);
        });

        try {
          await this._mideaService.create(formData).toPromise();
          this._toarstr.success(`Enviado ${batch.length} arquivos com sucesso!`);
        } catch (error) {
          this._toarstr.error('Erro ao enviar arquivos.');
          console.error(error);
          break;
        }
      }

      this.loading = false;
      this.getMidea();
    };

    uploadBatch();
  }

  onDragStart(midea: Midea): void {
    if (!this.selectedMideas.has(midea.id)) {
      this.selectedMideas.clear();
      this.selectedMideas.add(midea.id);
    }
    this.draggedMidea = midea;
  }


  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

onDrop(target: Midea): void {
  if (target.type !== 'folder') return;

  const mideasToMove = this.mideas.filter(m => this.selectedMideas.has(m.id));

  mideasToMove.forEach(midea => {
    if (midea.id === target.id) return;

    const formData = new FormData();
    formData.append('parent_id', target.id.toString());
    formData.append('service_id', this.service_id.toString());
    formData.append('description', midea.description);

    this._mideaService.update(midea.id, formData).subscribe({
      next: () => {
        this.getMidea();
      },
      error: () => {
        this._toarstr.error(`Erro ao mover ${midea.description}`);
      }
    });
  });

  this.selectedMideas.clear();
}

moveToPreviousFolder(midea: Midea): void {
  const ids = this.selectedMideas.size > 1 ? [...this.selectedMideas] : [midea.id];
  const previousParentId = this.parentStack[this.parentStack.length - 1] ?? null;

  ids.forEach(id => {
    const formData = new FormData();
    formData.append('parent_id', previousParentId ? previousParentId.toString() : '');
    formData.append('service_id', this.service_id.toString());

    const m = this.mideas.find(m => m.id === id);
    if (m) formData.append('description', m.description);

    this._mideaService.update(id, formData).subscribe({
      next: () => this.getMidea(),
      error: () => this._toarstr.error(`Erro ao mover item ${id}.`)
    });
  });

  this.selectedMideas.clear();
}

  onSelect(midea: Midea, index: number, event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey) {
      this.selectedMideas.has(midea.id) ? this.selectedMideas.delete(midea.id) : this.selectedMideas.add(midea.id);
    } else if (event.shiftKey && this.lastSelectedIndex !== null) {
      const rangeStart = Math.min(this.lastSelectedIndex, index);
      const rangeEnd = Math.max(this.lastSelectedIndex, index);
      for (let i = rangeStart; i <= rangeEnd; i++) {
        this.selectedMideas.add(this.mideas[i].id);
      }
    } else {
      this.selectedMideas.clear();
      this.selectedMideas.add(midea.id);
      this.lastSelectedIndex = index;
    }
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

onDelete(midea_id: number) {
  const targets = this.selectedMideas.size > 1 ? [...this.selectedMideas] : [midea_id];

  this._dialog.open(DialogConfirmComponent)
    .afterClosed()
    .subscribe((res) => {
      if (res) {
        this.deleteMany(targets);
      }
    });
}

deleteMany(ids: number[]) {
  this.loading = true;

  const deletions = ids.map(id =>
    this._mideaService.delete(id).toPromise().then(() => id).catch(() => null)
  );

  Promise.all(deletions)
    .then(results => {
      results.filter(id => id !== null).forEach(id => {
        this.mideas = this.mideas.filter(m => m.id !== id);
      });
      this.selectedMideas.clear();
      this._toarstr.success('Itens removidos com sucesso.');
    })
    .catch(() => {
      this._toarstr.error('Erro ao excluir um ou mais itens.');
    })
    .finally(() => {
      this.loading = false;
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

async onFolderUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);

  if (!files.length) return;

  this.loading = true;

  const folderMap: { [path: string]: number } = {};

  for (const file of files) {
    const fullPath = (file as any).webkitRelativePath;
    const pathParts = fullPath.split('/');
    pathParts.shift(); // remove a pasta raiz
    const fileName = pathParts.pop();

    let currentPath = '';
    let currentParentId = this.parentId;

    for (const folderName of pathParts) {
      currentPath += currentPath ? `/${folderName}` : folderName;

      if (!folderMap[currentPath]) {
        const formData = new FormData();
        formData.append('description', folderName);
        formData.append('service_id', this.service_id.toString());
        formData.append('type', 'folder');
        if (currentParentId) {
          formData.append('parent_id', currentParentId.toString());
        }

        try {
          console.log('Criando pasta:', currentPath, '-> parent_id:', currentParentId);

          const res = await this._mideaService.create(formData).toPromise();
          folderMap[currentPath] = res.data[0].id;
          console.log('Resposta da pasta criada:', res);
          console.log(folderMap[currentPath]);

        } catch (error) {
          this._toarstr.error(`Erro ao criar pasta ${folderName}`);
          console.error(error);
          break;
        }
      }

      currentParentId = folderMap[currentPath];
    }

    const fileForm = new FormData();
    fileForm.append('mideas[0]', file);
    fileForm.append('description', fileName);
    fileForm.append('service_id', this.service_id.toString());
    fileForm.append('type', 'media');
    if (currentParentId) fileForm.append('parent_id', currentParentId.toString());

    try {
      await this._mideaService.create(fileForm).toPromise();
    } catch (error) {
      this._toarstr.error(`Erro ao enviar ${fileName}`);
      console.error(error);
    }
  }

  this.loading = false;
  this.getMidea();
}

sort(field: string): void {
  const currentField = this.form.get('order_by')?.value;
  const currentOrder = this.form.get('order')?.value;

  if (currentField === field) {
    this.form.get('order')?.setValue(currentOrder === 'ASC' ? 'DESC' : 'ASC');
  } else {
    this.form.get('order_by')?.setValue(field);
    this.form.get('order')?.setValue('ASC');
  }
}

getSortIcon(field: string): string {
  const currentField = this.form.get('order_by')?.value;
  const currentOrder = this.form.get('order')?.value;

  if (currentField !== field) return 'fa-sort';
  return currentOrder === 'ASC' ? 'fa-sort-up' : 'fa-sort-down';
}


}
