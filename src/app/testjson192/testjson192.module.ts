import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson192Page } from './testjson192.page';

import { Testjson192PageRoutingModule } from './testjson192-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson192PageRoutingModule
  ],
  declarations: [Testjson192Page],
})
export class Testjson192PageModule {}
