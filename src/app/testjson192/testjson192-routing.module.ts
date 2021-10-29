import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson192Page } from './testjson192.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson192Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson192PageRoutingModule {}
