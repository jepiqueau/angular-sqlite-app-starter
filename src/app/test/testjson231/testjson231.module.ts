import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Testjson231Page } from './testjson231.page';

import { Testjson231PageRoutingModule } from './testjson231-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Testjson231PageRoutingModule
  ],
  declarations: [Testjson231Page],
})
export class Testjson231PageModule {}
