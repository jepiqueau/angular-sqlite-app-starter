import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson101Page } from './testjson101.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson101Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson101PageRoutingModule {}
