import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson94Page } from './testjson94.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson94Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson94PageRoutingModule {}
