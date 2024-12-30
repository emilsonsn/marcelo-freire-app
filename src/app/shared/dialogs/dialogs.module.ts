import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from '@shared/components/components.module';
import {DirectivesModule} from '@shared/directives/directives.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {PipesModule} from '@shared/pipes/pipes.module';
import {DialogConfirmComponent} from './dialog-confirm/dialog-confirm.component';
import {DialogCollaboratorComponent} from './dialog-collaborator/dialog-collaborator.component';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import {MatRippleModule} from '@angular/material/core';
import {NgxMaskDirective, NgxMaskPipe} from 'ngx-mask';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {DialogServiceComponent} from './dialog-service/dialog-service.component';
import {DialogClientComponent} from './dialog-client/dialog-client.component';
import {TablesModule} from '@shared/tables/tables.module';
import {DialogTypeServiceComponent} from './dialog-type-service/dialog-type-service.component';
import {DialogTypeUserSectorComponent} from './dialog-type-user-sector/dialog-type-user-sector.component';
import {MatIcon} from "@angular/material/icon";
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {DialogOrderSolicitationComponent} from './dialog-order-solicitation/dialog-order-solicitation.component';
import { DialogMideaComponent } from './dialog-midea/dialog-midea.component';
import { DialogCommentComponent } from './dialog-comment/dialog-comment.component';
import { DialogShowCommentsComponent } from './dialog-show-comments/dialog-show-comments.component';


@NgModule({
  declarations: [
    DialogConfirmComponent,
    DialogCollaboratorComponent,
    DialogMideaComponent,
    DialogServiceComponent,
    DialogClientComponent,
    DialogShowCommentsComponent,
    DialogTypeServiceComponent,
    DialogTypeUserSectorComponent,
    DialogCommentComponent,
    DialogOrderSolicitationComponent
  ],
  imports: [
    CommonModule,
    TablesModule,
    ComponentsModule,
    DirectivesModule,
    ClipboardModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatRippleModule,
    TextFieldModule,
    CdkTextareaAutosize,
    CurrencyMaskModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxMatSelectSearchModule,
    MatIcon
  ]
})
export class DialogsModule {
}
