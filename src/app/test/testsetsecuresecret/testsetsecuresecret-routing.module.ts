import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestSetSecureSecretPage } from './testsetsecuresecret.page';

const routes: Routes = [
  {
    path: '',
    component: TestSetSecureSecretPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestSetSecureSecretPageRoutingModule {}
