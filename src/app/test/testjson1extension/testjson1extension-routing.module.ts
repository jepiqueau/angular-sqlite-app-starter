import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestJson1ExtensionPage } from './testjson1extension.page';

const routes: Routes = [
  {
    path: '',
    component: TestJson1ExtensionPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestJson1ExtensionPageRoutingModule {}
