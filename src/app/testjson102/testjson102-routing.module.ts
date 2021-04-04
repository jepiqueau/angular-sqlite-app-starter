import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson102Page } from './testjson102.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson102Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson102PageRoutingModule {}
