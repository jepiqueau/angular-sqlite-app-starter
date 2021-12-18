import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestNCDbsPage } from './testncdbs.page';

const routes: Routes = [
  {
    path: '',
    component: TestNCDbsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestNCDbsPageRoutingModule {}
