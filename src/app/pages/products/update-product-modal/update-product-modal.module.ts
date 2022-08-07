import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UpdateProductModalComponent } from './update-product-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    UpdateProductModalComponent
  ],
  declarations: [UpdateProductModalComponent],
})
export class UpdateProductModalModule { }
