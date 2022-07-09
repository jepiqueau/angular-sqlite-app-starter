import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';

import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testsetsecuresecret',
  templateUrl: 'testsetsecuresecret.page.html',
  styleUrls: ['testsetsecuresecret.page.scss']
})
export class TestSetSecureSecretPage implements AfterViewInit {
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
    console.log("%%%% in TestSetSecureSecretPage this._sqlite " + this._sqlite)
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
      // Deal with the secure secret if you need it
      // by using an input form
      // here i used a constant
        const secretPhrase = 'abbey clammy gird night test';
        const isSet = await this._sqlite.isSecretStored()
        if(!isSet.result) {
            await this._sqlite.setEncryptionSecret(secretPhrase);
        } else {
          return Promise.reject(new Error("the secret is already stored"));
        }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
