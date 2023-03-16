import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson385Page } from './testjson385.page';

import { Testjson385PageRoutingModule } from './testjson385-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson385PageRoutingModule
  ],
  declarations: [Testjson385Page],
})
export class Testjson385PageModule {}
