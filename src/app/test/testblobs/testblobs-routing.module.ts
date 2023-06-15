import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestBlobsPage } from './testblobs.page';

const routes: Routes = [
  {
    path: '',
    component: TestBlobsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestBlobsPageRoutingModule {}
