import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson292Page } from './testjson292.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson292Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson292PageRoutingModule {}
