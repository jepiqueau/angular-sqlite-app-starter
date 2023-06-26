import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestClearSecureSecretPage } from './testclearsecuresecret.page';

const routes: Routes = [
  {
    path: '',
    component: TestClearSecureSecretPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestClearSecureSecretPageRoutingModule {}
