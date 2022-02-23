import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestSetSecureSecretPage } from './testsetsecuresecret.page';
import { TestSetSecureSecretPageRoutingModule } from './testsetsecuresecret-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestSetSecureSecretPageRoutingModule
  ],
  declarations: [TestSetSecureSecretPage],
})
export class TestSetSecureSecretPageModule {}
