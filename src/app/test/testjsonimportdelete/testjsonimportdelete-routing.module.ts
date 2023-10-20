import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestjsonimportdeletePage } from './testjsonimportdelete.page';

const routes: Routes = [
  {
    path: '',
    component: TestjsonimportdeletePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestjsonimportdeletePageRoutingModule {}
