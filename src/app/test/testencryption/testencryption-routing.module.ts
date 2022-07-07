import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestencryptionPage } from './testencryption.page';

const routes: Routes = [
  {
    path: '',
    component: TestencryptionPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestencryptionPageRoutingModule {}
