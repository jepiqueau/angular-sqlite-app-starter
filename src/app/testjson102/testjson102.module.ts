import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson102Page } from './testjson102.page';

import { Testjson102PageRoutingModule } from './testjson102-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson102PageRoutingModule
  ],
  declarations: [Testjson102Page],
})
export class Testjson102PageModule {}
