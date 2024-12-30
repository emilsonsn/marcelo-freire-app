import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Service } from '@models/service';
import { ServiceService } from '@services/service.service';
import { DialogTypeServiceComponent } from '../dialog-type-service/dialog-type-service.component';
import { Client } from '@models/client';
import { ClientService } from '@services/client.service';
import { UserService } from '@services/user.service';
import { User } from '@models/user';
import { SessionService } from '@store/session.service';

@Component({
  selector: 'app-dialog-service',
  templateUrl: './dialog-service.component.html',
  styleUrl: './dialog-service.component.scss'
})
export class DialogServiceComponent {

  public isNewService: boolean = true;
  public title: string = 'Novo serviço';

  public form: FormGroup;

  public loading : boolean = false;

  public servicesTypeEnum;

  public clients: Client[];
  public users: User[];
  public isAdmin = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {service: Service},
    private readonly _dialogRef: MatDialogRef<DialogServiceComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _sessionService : SessionService,
    private readonly _clientService : ClientService,
    private readonly _userService : UserService,
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      title: [null, [Validators.required]],
      description: [null],
      client_id: [null, [Validators.required]],
      users: [null, [Validators.required]],
      status: [null]
    })

    if (this._data?.service) {
      this.isNewService = false;
      this.title = 'Editar serviço';

      const users = this._data?.service.users.map(user => user.id);
      this._fillForm({
        ...this._data.service,
        users: users
      });
    }

    this.getClients();
    this.getUsers();
    this.loadPosition();
  }

  loadPosition(){
    this._sessionService
    .getUser()
    .subscribe({
      next: (user) => {
        this.isAdmin = user.role == 'Admin';
      }
    })
  }

  getClients(){
    this._clientService.getAll()
    .subscribe({
      next: (res) => {
        this.clients = res.data;
      }
    })
  }

  getUsers(){
    this._userService.getUsers({}, {status: 'Manager'})
    .subscribe({
      next: (res) => {
        this.users = res.data;
      }
    })
  }

  private _fillForm(service): void {

    this.form.patchValue(service);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if(!form.valid){
      form.markAllAsTouched();
    }else{
      this._dialogRef.close(form.getRawValue())
    }
  }

}
