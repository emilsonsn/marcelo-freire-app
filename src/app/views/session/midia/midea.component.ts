import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Midea } from '@models/midea';
import { MideaService } from '@services/midea.service';
import { DialogCommentComponent } from '@shared/dialogs/dialog-comment/dialog-comment.component';
import { AnimationOptions } from 'ngx-lottie';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-midea',
  templateUrl: './midea.component.html',
  styleUrl: './midea.component.scss'
})
export class MideaComponent {

  form: FormGroup;
  primaryBtnText: string = "Continuar";
  showMideas: boolean = false;
  countdown: number = 60;
  mideas : Midea[];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private readonly _mideaService: MideaService,
    private readonly _toastrService: ToastrService,
    private readonly _dialog: MatDialog,    
  ) {    
  }

  ngOnInit(){
    this.form = this.fb.group({
      code: ['', [Validators.required]]
    });

    this.onSubmit();
  }

  onSubmit() {
    if(!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.getMideas();
  }

  getMideas(){
    this._mideaService
    .getByCode(this.form.get('code').value)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (res) => {
        this.showMideas = true;
        this.mideas = res.data;
      },
      error: (error) => {
        this._toastrService.error(error.error.error);
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
  
  options: AnimationOptions = {
    path: '/assets/json/animation_no_recover.json',
  };
  
    public openDialogComment(midea_id: number) {
      const dialogConfig: MatDialogConfig = {
        width: '80%',
        maxWidth: '600px',
        maxHeight: '90%',
        hasBackdrop: true,
        closeOnNavigation: true,
      };
  
      this._dialog.open(DialogCommentComponent,
          {
            ...dialogConfig,
            data: {midea_id}
          })
        .afterClosed()
        .subscribe((comment) => {
          if(!comment){
            return;
          }
          
          this._mideaService
          .addComment(comment)
          .subscribe({
            next: (res) => {
              this._toastrService.success(res.message)
              this.getMideas();
            },
            error: (error) =>{
              this._toastrService.error(error.error.message)
            }
          })
        })
    }

    downloadFiles() {
      const code = this.form.get('code').value;
    
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
    
  
}
