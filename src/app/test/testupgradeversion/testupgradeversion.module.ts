import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestupgradeversionPage } from './testupgradeversion.page';

import { TestupgradeversionPageRoutingModule } from './testupgradeversion-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestupgradeversionPageRoutingModule
  ],
  declarations: [TestupgradeversionPage],
})
export class TestupgradeversionPageModule {}
