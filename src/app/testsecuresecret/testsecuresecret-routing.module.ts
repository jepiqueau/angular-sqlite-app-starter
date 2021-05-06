import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestSecureSecretPage } from './testsecuresecret.page';

const routes: Routes = [
  {
    path: '',
    component: TestSecureSecretPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestSecureSecretPageRoutingModule {}
