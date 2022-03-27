import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testjson237Page } from './testjson237.page';

const routes: Routes = [
  {
    path: '',
    component: Testjson237Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testjson237PageRoutingModule {}
