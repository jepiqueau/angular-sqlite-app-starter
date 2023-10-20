import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestSlowInsertsPage } from './testslowinserts.page';

const routes: Routes = [
  {
    path: '',
    component: TestSlowInsertsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestSlowInsertsPageRoutingModule {}
