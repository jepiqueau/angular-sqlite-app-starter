import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadToCacheAndMove } from './downloadtocacheandmove.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadToCacheAndMove,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadToCacheAndMoveRoutingModule {}
