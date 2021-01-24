import { Component } from '@angular/core';
import { DetailService } from '../services/detail.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public exConn: boolean;
  public exJson: boolean

  constructor(private _detailService: DetailService) {
  }
  ionViewWillEnter() {
    
      this.exConn = this._detailService.getExistingConnection();
      this.exJson = this._detailService.getExportJson();
      console.log("**** ionViewWillEnter " + this.exConn);

  }

}
