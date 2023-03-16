import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson385Page } from './testjson385.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson385Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson385PageRoutingModule {}
