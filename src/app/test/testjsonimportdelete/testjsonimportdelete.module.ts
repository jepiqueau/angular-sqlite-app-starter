import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestjsonimportdeletePage } from './testjsonimportdelete.page';

import { TestjsonimportdeletePageRoutingModule } from './testjsonimportdelete-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestjsonimportdeletePageRoutingModule
  ],
  declarations: [TestjsonimportdeletePage],
})
export class TestjsonimportdeletePageModule {}
