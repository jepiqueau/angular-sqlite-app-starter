import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestIssue111Page } from './testissue111.page';

const routes: Routes = [
  {
    path: '',
    component: TestIssue111Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestIssue111PageRoutingModule {}
