import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductDefaultQueryRepository } from 'src/app/repositories/product.default.query.repository';
import { ProductRepository } from 'src/app/repositories/product.repository';
import { IonModal, ModalController } from '@ionic/angular';
import { CreateProductModalComponent } from './create-product-modal/create-product-modal.component';
import { Product } from 'src/app/models/Product';
import { UpdateProductModalComponent } from './update-product-modal/update-product-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss'],
})
export class ProductsPage implements OnInit {
  public products: Product[] = [];
  @ViewChild(IonModal) createProduct: IonModal;
  @ViewChild(IonModal) updateProduct: IonModal;
  name: string;

  constructor(private productRepository: ProductRepository, private productDefaultQueryRepository: ProductDefaultQueryRepository, private modalCtrl: ModalController) { }

  ngOnInit(): void {
    this.getProducts();
  }

  async openCreateProductModal() {
    const modal = await this.modalCtrl.create({
      component: CreateProductModalComponent
    });

    modal.present();
    const { data: createdProduct, role } = await modal.onWillDismiss<Product>();

    if (role === 'confirm') {
      console.log(`creating product: ${JSON.stringify(createdProduct)}`);

      await this.productRepository.createProduct(createdProduct);

      this.products.push(createdProduct);
    }
  }

  async openUpdateProductModal(product: Product) {
    const modal = await this.modalCtrl.create({
      component: UpdateProductModalComponent,
      componentProps: {
        product: Object.assign({}, product)
      }
    });

    modal.present();

    const { data: updatedProduct, role } = await modal.onWillDismiss<Product>();

    if (role === 'confirm') {

      console.log(`updating product: ${JSON.stringify(updatedProduct)}`);

      await this.productRepository.updateProduct(updatedProduct);

      this.products.splice(this.products.findIndex(p => p.id === updatedProduct.id), 1, updatedProduct);
    }
  }

  async getProducts() {
    await this.productRepository.createTestData();
    this.products = await this.productRepository.getProducts();
    console.log(`databaseService used: products:`);
    console.log(this.products);

    //normal db open db close version
    // await this.productDefaultQueryRepository.getProducts();
    // console.log(`default dbopen dbclose used:`);
    // console.log(this.products);
  }

  async deleteProduct(productId: number) {
    await this.productRepository.deleteProductById(productId);
    this.products = this.products.filter(p => p.id !== productId);
  }

  async editProduct(productId: number) {
    console.log(`editing product ${productId}`);
  }
}
