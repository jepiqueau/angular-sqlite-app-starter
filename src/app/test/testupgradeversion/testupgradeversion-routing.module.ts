import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestupgradeversionPage } from './testupgradeversion.page';

const routes: Routes = [
  {
    path: '',
    component: TestupgradeversionPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestupgradeversionPageRoutingModule {}
