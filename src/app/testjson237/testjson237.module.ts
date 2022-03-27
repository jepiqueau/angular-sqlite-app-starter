import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson237Page } from './testjson237.page';

import { Testjson237PageRoutingModule } from './testjson237-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson237PageRoutingModule
  ],
  declarations: [Testjson237Page],
})
export class Testjson237PageModule {}
