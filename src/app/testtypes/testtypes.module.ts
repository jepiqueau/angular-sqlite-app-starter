import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestTypesPage } from './testtypes.page';
import { TestTypesPageRoutingModule } from './testtypes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestTypesPageRoutingModule
  ],
  declarations: [TestTypesPage],
})
export class TestTypesPageModule {}
