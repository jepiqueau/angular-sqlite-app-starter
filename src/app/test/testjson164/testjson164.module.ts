import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson164Page } from './testjson164.page';

import { Testjson164PageRoutingModule } from './testjson164-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson164PageRoutingModule
  ],
  declarations: [Testjson164Page],
})
export class Testjson164PageModule {}
