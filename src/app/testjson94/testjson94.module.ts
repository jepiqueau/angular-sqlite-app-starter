import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson94Page } from './testjson94.page';

import { Testjson94PageRoutingModule } from './testjson94-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson94PageRoutingModule
  ],
  declarations: [Testjson94Page],
})
export class Testjson94PageModule {}
