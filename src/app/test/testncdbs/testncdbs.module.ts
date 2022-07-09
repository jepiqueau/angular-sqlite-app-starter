import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestNCDbsPage } from './testncdbs.page';
import { TestNCDbsPageRoutingModule } from './testncdbs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestNCDbsPageRoutingModule
  ],
  declarations: [TestNCDbsPage],
})
export class TestNCDbsPageModule {}
