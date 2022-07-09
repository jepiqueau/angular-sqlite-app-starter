import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeTestsPage } from './hometests.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTestsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeTestsPageRoutingModule {}
