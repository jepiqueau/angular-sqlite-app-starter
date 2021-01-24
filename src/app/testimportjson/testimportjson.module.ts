import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestimportjsonPage } from './testimportjson.page';

import { TestimportjsonPageRoutingModule } from './testimportjson-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestimportjsonPageRoutingModule
  ],
  declarations: [TestimportjsonPage],
})
export class TestimportjsonPageModule {}
