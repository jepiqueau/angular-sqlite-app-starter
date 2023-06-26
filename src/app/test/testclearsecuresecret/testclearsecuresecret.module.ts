import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestClearSecureSecretPage } from './testclearsecuresecret.page';
import { TestClearSecureSecretPageRoutingModule } from './testclearsecuresecret-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestClearSecureSecretPageRoutingModule
  ],
  declarations: [TestClearSecureSecretPage],
})
export class TestClearSecureSecretPageModule {}
