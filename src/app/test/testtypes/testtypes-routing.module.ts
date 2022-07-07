import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestTypesPage } from './testtypes.page';

const routes: Routes = [
  {
    path: '',
    component: TestTypesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestTypesPageRoutingModule {}
