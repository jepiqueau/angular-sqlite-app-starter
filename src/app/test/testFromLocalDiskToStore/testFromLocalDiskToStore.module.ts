import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestFromLocalDiskToStore } from './testFromLocalDiskToStore.page';

import { TestFromLocalDiskToStoreRoutingModule } from './testFromLocalDiskToStore-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestFromLocalDiskToStoreRoutingModule
  ],
  declarations: [TestFromLocalDiskToStore],
})
export class TestFromLocalDiskToStoreModule {}
