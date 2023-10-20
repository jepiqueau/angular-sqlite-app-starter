import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestjsonoptimizePage } from './testjsonoptimize.page';

import { TestjsonoptimizePageRoutingModule } from './testjsonoptimize-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestjsonoptimizePageRoutingModule
  ],
  declarations: [TestjsonoptimizePage],
})
export class TestjsonoptimizePageModule {}
