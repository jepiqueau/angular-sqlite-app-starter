import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistingconnectionPage } from './existingconnection.page';

const routes: Routes = [
  {
    path: '',
    component: ExistingconnectionPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExistingconnectionPageRoutingModule {}
