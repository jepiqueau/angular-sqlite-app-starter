import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestCheckSecureSecretPage } from './testchecksecuresecret.page';

const routes: Routes = [
  {
    path: '',
    component: TestCheckSecureSecretPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestCheckSecureSecretPageRoutingModule {}
