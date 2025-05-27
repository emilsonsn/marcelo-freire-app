
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Supplier, SupplierType } from '@models/supplier';
import { TypeProviderService } from '@services/type-provider.service';
import { Utils } from '@shared/utils';
import { Estados } from '@models/utils';
import { map, ReplaySubject } from 'rxjs';
import { UtilsService } from '@services/utils.service';
import { ToastrService } from 'ngx-toastr';
import { Midea } from '@models/midea';
import { MideaService } from '@services/midea.service';

@Component({
  selector: 'app-midea-provider',
  templateUrl: './dialog-midea.component.html',
  styleUrl: './dialog-midea.component.scss'
})
export class DialogMideaComponent {

  public isNewProvider: boolean = true;
  public title: string = 'Novo mídia';

  public form: FormGroup;

  public providerTypeEnum;

  public loading : boolean = false;

  public utils = Utils;
  public filePreviews: Array<{ name: string; preview: string | ArrayBuffer; rawFile: File }> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {midea: Midea, service_id: number, parent_id: number},
    private readonly _dialogRef: MatDialogRef<DialogMideaComponent>,
    private readonly _fb: FormBuilder,
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [''],
      description: [''],
      path: [''],
      user_id: [''],
      service_id: [''],
      parent_id: [''],
      type: ['folder'],
    })

    this.form.get('service_id').patchValue(this._data.service_id);
    this.form.get('parent_id').patchValue(this._data.parent_id);

    if (this._data?.midea) {
      this.isNewProvider = false;
      this.title = 'Editar mídia';
      this._fillForm(this._data.midea);
    }

  }

  private _fillForm(midea: Midea): void {

    this.form.patchValue(midea);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
      return;
    } else {
      const formData = new FormData();
  
      const formValues = form.getRawValue();
      Object.keys(formValues).forEach((key) => {
        if (formValues[key]) {
          formData.append(key, formValues[key]);
        }
      });
  
      this.filePreviews.forEach((file, indice) => {
        formData.append(`mideas[${indice}]`, file.rawFile);
      });
  
      this._dialogRef.close(formData);
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filePreviews.push({
            name: file.name,
            preview: e.target?.result as string,
            rawFile: file
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      Array.from(event.dataTransfer.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filePreviews.push({
            name: file.name,
            preview: e.target?.result as string,
            rawFile: file // Armazena o arquivo original
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  
  removeFile(index: number): void {
    this.filePreviews.splice(index, 1);
  }
  
  isImage(file: { name: string }): boolean {
    return /\.(jpg|jpeg|png|gif|raw)$/i.test(file.name);
  }
  
  isVideo(file: { name: string }): boolean {
    return /\.(mov|mp4)$/i.test(file.name);
  }
  
  isAudio(file: { name: string }): boolean {
    return /\.(wav|mp3)$/i.test(file.name);
  }

}
