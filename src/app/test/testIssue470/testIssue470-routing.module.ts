import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestIssue470Page } from './testIssue470.page';

const routes: Routes = [
  {
    path: '',
    component: TestIssue470Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestIssue470PageRoutingModule {}
