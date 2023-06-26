import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';

import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testclearsecuresecret',
  templateUrl: 'testclearsecuresecret.page.html',
  styleUrls: ['testclearsecuresecret.page.scss']
})
export class TestClearSecureSecretPage implements AfterViewInit {
  detail: boolean = false;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;
  showAlert: any;

  constructor(private _sqlite: SQLiteService) {
  }

  async ngAfterViewInit() {
    this.showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    console.log("%%%% in TestClearSecureSecretPage this._sqlite " + this._sqlite)
    try {
      await this.runTest();
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } catch (err) {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log(`$$$ runTest failed ${err.message}`);
      await this.showAlert(err.message);
    }
  }


  async runTest(): Promise<void> {
    try {
      await this._sqlite.clearEncryptionSecret();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
