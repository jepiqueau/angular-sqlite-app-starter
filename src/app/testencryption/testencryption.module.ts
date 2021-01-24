import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestencryptionPage } from './testencryption.page';

import { TestencryptionPageRoutingModule } from './testencryption-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestencryptionPageRoutingModule
  ],
  declarations: [TestencryptionPage],
})
export class TestencryptionPageModule {}
