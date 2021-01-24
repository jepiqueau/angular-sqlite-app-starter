import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Test2dbsPage } from './test2dbs.page';

const routes: Routes = [
  {
    path: '',
    component: Test2dbsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Test2dbsPageRoutingModule {}
