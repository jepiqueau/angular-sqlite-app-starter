import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson231Page } from './testjson231.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson231Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson231PageRoutingModule {}
