import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CopyfromassetsPage } from './copyfromassets.page';

import { CopyfromassetsPageRoutingModule } from './copyfromassets-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CopyfromassetsPageRoutingModule
  ],
  declarations: [CopyfromassetsPage],
})
export class CopyfromassetsPageModule {}
