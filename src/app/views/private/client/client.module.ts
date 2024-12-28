import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import {MatRipple} from "@angular/material/core";
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ClientComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    MatDialogModule,
    MatRipple,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class ClientModule { }
