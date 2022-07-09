import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson164Page } from './testjson164.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson164Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson164PageRoutingModule {}
