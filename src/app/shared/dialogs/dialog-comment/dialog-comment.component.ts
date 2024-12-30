import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {TaskService} from "@services/task.service";

@Component({
  selector: 'app-dialog-comment',
  templateUrl: './dialog-comment.component.html',
  styleUrls: ['./dialog-comment.component.scss']
})
export class DialogCommentComponent {

  public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected readonly data,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCommentComponent>,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      midea_id: ['', [Validators.required]],
      comment: ['', [Validators.required]],
    });

    this.form.get('midea_id').patchValue(this.data.midea_id);   
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.dialogRef.close(
      this.form.getRawValue()
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
