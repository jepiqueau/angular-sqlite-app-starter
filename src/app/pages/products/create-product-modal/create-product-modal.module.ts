import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CreateProductModalComponent } from './create-product-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    CreateProductModalComponent
  ],
  declarations: [CreateProductModalComponent],
})
export class CreateProductModalModule { }
