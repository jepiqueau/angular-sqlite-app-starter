import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestChangeSecureSecretPage } from './testchangesecuresecret.page';

const routes: Routes = [
  {
    path: '',
    component: TestChangeSecureSecretPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestChangeSecureSecretPageRoutingModule {}
