import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson167Page } from './testjson167.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson167Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson167PageRoutingModule {}
