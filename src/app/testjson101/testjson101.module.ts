import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson101Page } from './testjson101.page';

import { Testjson101PageRoutingModule } from './testjson101-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson101PageRoutingModule
  ],
  declarations: [Testjson101Page],
})
export class Testjson101PageModule {}
