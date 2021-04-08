import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson104Page } from './testjson104.page';

import { Testjson104PageRoutingModule } from './testjson104-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson104PageRoutingModule
  ],
  declarations: [Testjson104Page],
})
export class Testjson104PageModule {}
