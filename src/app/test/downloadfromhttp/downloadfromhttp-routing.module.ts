import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadFromHTTP } from './downloadfromhttp.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadFromHTTP,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadFromHTTPRoutingModule {}
