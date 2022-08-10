import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-create-product-modal',
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.scss'],
})
export class CreateProductModalComponent implements OnInit {
  product: Product;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit(): void {
    this.product = {
      name: '',
      price: null,
      isAvailable: true,
      description: '',
      imageUrl: '',
      category: '',
      isPopular: false
    } as Product;
  }

  cancel() {
    console.log(this.product);
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.product.name && this.product.price) {
      return this.modalCtrl.dismiss(this.product, 'confirm');
    }
  }
}