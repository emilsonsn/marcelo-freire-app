import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ServicesComponent} from "@app/views/private/services/services/services.component";
import { MideasComponent } from './mideas/mideas.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent
  },
  {
    path: ':id',
    component: MideasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
