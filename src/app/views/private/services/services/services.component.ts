import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Service } from '@models/service';
import { ServiceService } from '@services/service.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogServiceComponent } from '@shared/dialogs/dialog-service/dialog-service.component';
import { SessionService } from '@store/session.service';
import { ToastrService } from 'ngx-toastr';
import { debounce, debounceTime, finalize } from 'rxjs';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  public loading: boolean = false;
  public services: Service[];
  public form: FormGroup;
  public isAdmin: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _serviceService: ServiceService,
    private readonly _formBuilder: FormBuilder,
    private readonly _sessionService: SessionService,
    private readonly _route: Router
  ) {}

  ngOnInit(){
    this.getServices();

    this.form = this._formBuilder.group({
      search_term: [''],
      status: [''],
    });
    this.form
      .valueChanges
      .pipe(debounceTime(500))
      .subscribe((form) => {
        this.getServices(form)
    });

    this.loadPosition();
  }

  public loadPosition(){
    this._sessionService
      .getUser()
      .subscribe((user) => {
        this.isAdmin = user.role === 'Admin';
      })
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  getServices(filters?: any) {
    this._initOrStopLoading();
  
    this._serviceService
      .getServices({}, filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
          this.services = res.data;
      });
  }

  openDialogService(service?: Service) {
    this._dialog
      .open(DialogServiceComponent, {
        data: { service },
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.id) {
            this._patchService(res);
            return;
          }

          this._postService(res);
        }
      });
  }

  _patchService(service: Service) {
    this._initOrStopLoading();

    this._serviceService
      .patchService(service.id, service)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.getServices();
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  goToMidia(event, id){
    event.preventDefault();
    event.stopPropagation();
    this._route.navigate(['/painel/services/' + id])
  }

  private _postService(service: Service) {
    this._initOrStopLoading();

    this._serviceService
      .postService(service)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.getServices();
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  onDeleteService(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteService(id);
        }
      });
  }

  private _deleteService(id: number) {
    this._initOrStopLoading();
    this._serviceService
      .deleteService(id)
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
