import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-update-product-modal',
  templateUrl: './update-product-modal.component.html',
  styleUrls: ['./update-product-modal.component.scss'],
})
export class UpdateProductModalComponent {
  product: Product;

  constructor(private modalCtrl: ModalController) { }


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.product.name && this.product.price) {
      return this.modalCtrl.dismiss(this.product, 'confirm');
    }
  }
}