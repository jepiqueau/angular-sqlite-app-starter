import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestCopyPage } from './testcopy.page';

import { TestCopyPageRoutingModule } from './testcopy-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestCopyPageRoutingModule
  ],
  declarations: [TestCopyPage],
})
export class TestCopyPageModule {}
