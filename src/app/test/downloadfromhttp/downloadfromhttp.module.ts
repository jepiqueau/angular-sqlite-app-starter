import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DownloadFromHTTP } from './downloadfromhttp.page';

import { DownloadFromHTTPRoutingModule } from './downloadfromhttp-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadFromHTTPRoutingModule
  ],
  declarations: [DownloadFromHTTP],
})
export class DownloadFromHTTPModule {}
