import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson245Page } from './testjson245.page';

import { Testjson245PageRoutingModule } from './testjson245-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson245PageRoutingModule
  ],
  declarations: [Testjson245Page],
})
export class Testjson245PageModule {}
