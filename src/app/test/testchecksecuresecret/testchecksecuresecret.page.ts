import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';

import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testchecksecuresecret',
  templateUrl: 'testchecksecuresecret.page.html',
  styleUrls: ['testchecksecuresecret.page.scss']
})
export class TestCheckSecureSecretPage implements AfterViewInit {
  detail: boolean = false;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;
  showAlert: any;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
    this.showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    console.log("%%%% in TestCheckSecureSecretPage this._sqlite " + this._sqlite)
    try {
      await this.runTest();
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log(`$$$ runTest failed ${msg}`);
      await this.showAlert(msg);
    }
  }


  async runTest(): Promise<void> {
    try {

      const ret1 = (await this._sqlite.checkEncryptionSecret('abbey clammy gird night test')).result;
      console.log(`first password: ${ret1}`);

      const ret2 = (await this._sqlite.checkEncryptionSecret('how million space by locate')).result;
      console.log(`second password: ${ret2}`);

      if(ret1 == true || ret2 == false) {
        return Promise.reject(`checkEncryptionSecret failed`);
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
