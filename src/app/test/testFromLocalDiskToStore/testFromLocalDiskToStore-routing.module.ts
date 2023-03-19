import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestFromLocalDiskToStore} from './testFromLocalDiskToStore.page';

const routes: Routes = [
  {
    path: '',
    component: TestFromLocalDiskToStore,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestFromLocalDiskToStoreRoutingModule {}
