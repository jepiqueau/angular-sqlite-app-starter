import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson71Page } from './testjson71.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson71Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson71PageRoutingModule {}
