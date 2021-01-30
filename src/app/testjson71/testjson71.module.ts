import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson71Page } from './testjson71.page';

import { Testjson71PageRoutingModule } from './testjson71-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson71PageRoutingModule
  ],
  declarations: [Testjson71Page],
})
export class Testjson71PageModule {}
