import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Client } from '@models/client';
import { ClientService } from '@services/client.service';
import { DialogClientComponent } from '@shared/dialogs/dialog-client/dialog-client.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { debounce, debounceTime, finalize, pipe } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {User} from '@models/user';
import {ISmallInformationCard} from '@models/cardInformation';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit{
  public loading: boolean = false;
  public clients: Client[] = [];
  public filteredClients: Client[]= [];
  public form: FormGroup;
  public searchTerm: string;
  

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _clientService: ClientService,
    private readonly _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      search_term: [''],
    });
    this.form.get('search_term').valueChanges
      .pipe(debounceTime(500))
      .subscribe((search_Term)=>{
        this.searchTerm = search_Term;
      });

  }
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogClient(service?: Client) {
    this._dialog
      .open(DialogClientComponent, {
        data: { service },
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.id) {
            this._patchClient(res);
            return;
          }

          this._postClient(res);
        }
      });
  }

  _patchClient(service: Client) {
    this._initOrStopLoading();

    this._clientService
      .patchClient(service.id, service)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _postClient(service: Client) {
    this._initOrStopLoading();

    this._clientService
      .postClient(service)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  onDeleteClient(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteClient(id);
        }
      });
  }

  _deleteClient(id: number) {
    this._initOrStopLoading();
    this._clientService
      .deleteClient(id)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }
  
}

