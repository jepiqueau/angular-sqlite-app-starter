import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson292Page } from './testjson292.page';

import { Testjson292PageRoutingModule } from './testjson292-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson292PageRoutingModule
  ],
  declarations: [Testjson292Page],
})
export class Testjson292PageModule {}
