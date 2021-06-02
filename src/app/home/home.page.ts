import { Component } from '@angular/core';
import { DetailService } from '../services/detail.service';
import { SQLiteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public exConn: boolean;
  public exJson: boolean

  constructor(private sqlite: SQLiteService,
              private detailService: DetailService) {
  }
  ionViewWillEnter() {
    
      this.exConn = this.detailService.getExistingConnection();
      this.exJson = this.detailService.getExportJson();
      console.log("**** ionViewWillEnter " + this.exConn);

  }
  async ionViewDidEnter() {
    // Deal with the secure secret if you need it
    // by using an input form
    // here i used a constant
    const secretPhrase = 'abbey clammy gird night test';
    const isSet = await this.sqlite.isSecretStored()
    if(!isSet.result) {
      await this.sqlite.setEncryptionSecret(secretPhrase);
    }

  }

}
