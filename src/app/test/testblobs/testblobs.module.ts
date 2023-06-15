import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestBlobsPage } from './testblobs.page';
import { TestBlobsPageRoutingModule } from './testblobs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestBlobsPageRoutingModule
  ],
  declarations: [TestBlobsPage],
})
export class TestBlobsPageModule {}
