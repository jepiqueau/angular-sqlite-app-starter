import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson104Page } from './testjson104.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson104Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson104PageRoutingModule {}
