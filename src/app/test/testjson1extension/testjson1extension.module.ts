import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestJson1ExtensionPage } from './testjson1extension.page';
import { TestJson1ExtensionPageRoutingModule } from './testjson1extension-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestJson1ExtensionPageRoutingModule
  ],
  declarations: [TestJson1ExtensionPage],
})
export class TestJson1ExtensionPageModule {}
