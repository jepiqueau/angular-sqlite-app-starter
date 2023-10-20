import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestjsonoptimizePage } from './testjsonoptimize.page';

const routes: Routes = [
  {
    path: '',
    component: TestjsonoptimizePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestjsonoptimizePageRoutingModule {}
