import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestIssue230Page } from './testIssue230.page';

const routes: Routes = [
  {
    path: '',
    component: TestIssue230Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestIssue230PageRoutingModule {}
