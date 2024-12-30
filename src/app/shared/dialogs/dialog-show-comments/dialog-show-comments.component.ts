import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Comment } from '@models/midea';
import { SupplierType } from '@models/supplier';
import { TypeProviderService } from '@services/type-provider.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-show-comments',
  templateUrl: './dialog-show-comments.component.html',
  styleUrl: './dialog-show-comments.component.scss'
})
export class DialogShowCommentsComponent {

  public title: string = 'Tipos de fornecedor';
  public comments: Comment[] = [];
  

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: any,    
    private readonly _dialogRef: MatDialogRef<DialogShowCommentsComponent>,
  ) {}

  ngOnInit(): void {    
    this.comments = this._data;
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

}
