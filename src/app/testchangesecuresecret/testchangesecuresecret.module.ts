import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestChangeSecureSecretPage } from './testchangesecuresecret.page';
import { TestChangeSecureSecretPageRoutingModule } from './testchangesecuresecret-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestChangeSecureSecretPageRoutingModule
  ],
  declarations: [TestChangeSecureSecretPage],
})
export class TestChangeSecureSecretPageModule {}
