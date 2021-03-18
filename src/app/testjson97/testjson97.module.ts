import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson97Page } from './testjson97.page';

import { Testjson97PageRoutingModule } from './testjson97-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson97PageRoutingModule
  ],
  declarations: [Testjson97Page],
})
export class Testjson97PageModule {}
