import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CopyfromassetsPage } from './copyfromassets.page';

const routes: Routes = [
  {
    path: '',
    component: CopyfromassetsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyfromassetsPageRoutingModule {}
