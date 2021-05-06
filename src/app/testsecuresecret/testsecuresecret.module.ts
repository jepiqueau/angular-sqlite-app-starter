import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestSecureSecretPage } from './testsecuresecret.page';
import { TestSecureSecretPageRoutingModule } from './testsecuresecret-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestSecureSecretPageRoutingModule
  ],
  declarations: [TestSecureSecretPage],
})
export class TestSecureSecretPageModule {}
