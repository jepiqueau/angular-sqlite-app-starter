import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { UpdateProductModalModule } from './update-product-modal/update-product-modal.module';
import { CreateProductModalModule } from './create-product-modal/create-product-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    UpdateProductModalModule,
    CreateProductModalModule
  ],
  declarations: [ProductsPage],
})
export class ProductsPageModule { }
