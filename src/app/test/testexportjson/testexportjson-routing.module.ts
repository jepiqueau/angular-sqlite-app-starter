import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestexportjsonPage } from './testexportjson.page';

const routes: Routes = [
  {
    path: '',
    component: TestexportjsonPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestexportjsonPageRoutingModule {}
