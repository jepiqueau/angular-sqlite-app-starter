import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestReadonlyPage } from './testreadonly.page';

const routes: Routes = [
  {
    path: '',
    component: TestReadonlyPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestReadonlyPageRoutingModule {}
