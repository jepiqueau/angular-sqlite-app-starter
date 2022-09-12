import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestReadonlyPage } from './testreadonly.page';
import { TestReadonlyPageRoutingModule } from './testreadonly-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReadonlyPageRoutingModule
  ],
  declarations: [TestReadonlyPage],
})
export class TestReadonlyPageModule {}
