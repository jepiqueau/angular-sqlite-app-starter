import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestIssue445Page } from './testIssue445.page';

const routes: Routes = [
  {
    path: '',
    component: TestIssue445Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestIssue445PageRoutingModule {}
