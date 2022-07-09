import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testexportjson59Page } from './testexportjson59.page';

const routes: Routes = [
  {
    path: '',
    component: Testexportjson59Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testexportjson59PageRoutingModule {}
