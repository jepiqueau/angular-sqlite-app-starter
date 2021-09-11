import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson167Page } from './testjson167.page';

import { Testjson167PageRoutingModule } from './testjson167-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson167PageRoutingModule
  ],
  declarations: [Testjson167Page],
})
export class Testjson167PageModule {}
