import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestexportjsonPage } from './testexportjson.page';

import { TestexportjsonPageRoutingModule } from './testexportjson-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestexportjsonPageRoutingModule
  ],
  declarations: [TestexportjsonPage],
})
export class TestexportjsonPageModule {}
