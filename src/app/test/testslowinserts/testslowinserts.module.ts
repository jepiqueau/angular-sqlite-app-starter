import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestSlowInsertsPage } from './testslowinserts.page';
import { TestSlowInsertsPageRoutingModule } from './testslowinserts-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestSlowInsertsPageRoutingModule
  ],
  declarations: [TestSlowInsertsPage],
})
export class TestSlowInsertsPageModule {}
