import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestCopyPage } from './testcopy.page';

const routes: Routes = [
  {
    path: '',
    component: TestCopyPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestCopyPageRoutingModule {}
