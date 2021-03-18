import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson97Page } from './testjson97.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson97Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson97PageRoutingModule {}
