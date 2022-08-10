import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DownloadToCacheAndMove } from './downloadtocacheandmove.page';

import { DownloadToCacheAndMoveRoutingModule } from './downloadtocacheandmove-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadToCacheAndMoveRoutingModule
  ],
  declarations: [DownloadToCacheAndMove],
})
export class DownloadToCacheAndMoveModule {}
