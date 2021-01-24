import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestimportjsonPage } from './testimportjson.page';

const routes: Routes = [
  {
    path: '',
    component: TestimportjsonPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestimportjsonPageRoutingModule {}
