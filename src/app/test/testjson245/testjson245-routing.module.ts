import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson245Page } from './testjson245.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson245Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson245PageRoutingModule {}
