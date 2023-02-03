import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestCheckSecureSecretPage } from './testchecksecuresecret.page';
import { TestCheckSecureSecretPageRoutingModule } from './testchecksecuresecret-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestCheckSecureSecretPageRoutingModule
  ],
  declarations: [TestCheckSecureSecretPage],
})
export class TestCheckSecureSecretPageModule {}
