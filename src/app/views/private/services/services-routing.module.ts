import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ServicesComponent} from "@app/views/private/services/services/services.component";
import { MidiasComponent } from './midias/midias.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent
  },
  {
    path: ':id',
    component: MidiasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
