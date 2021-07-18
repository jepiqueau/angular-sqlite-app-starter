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
    console.log("**** in HomePage constructor")
  }
  ionViewWillEnter() {
    
      this.exConn = this.detailService.getExistingConnection();
      this.exJson = this.detailService.getExportJson();
      console.log(`**** ionViewWillEnter ${this.exConn}`);

  }
  async ionViewDidEnter() {
    // Deal with the secure secret if you need it
    // by using an input form
    // here i used a constant
    const secretPhrase = 'abbey clammy gird night test';
    console.log("**** ionViewDidEnter ");
    const isSet = await this.sqlite.isSecretStored()
    console.log(`**** ionViewDidEnter ${isSet.result}`);
    if(!isSet.result) {
      await this.sqlite.setEncryptionSecret(secretPhrase);
    }

  }

}
