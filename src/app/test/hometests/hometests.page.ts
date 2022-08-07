import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DetailService } from '../../services/detail.service';
import { SQLiteService } from '../../services/sqlite.service';
import { ChangeDetectorRef } from '@angular/core';

import config from 'capacitor.config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hometests',
  templateUrl: 'hometests.page.html',
  styleUrls: ['hometests.page.scss'],
})
export class HomeTestsPage {
  public exConn: boolean;
  public exJson: boolean;
  public native: boolean = false;
  public isDisplay: boolean = false;
  public environmentDatabase = environment.databaseName;
  private isBiometric: boolean = false;
  private platform: string;
  private biometricListener: any;

  constructor(private _sqlite: SQLiteService,
    private _detailService: DetailService,
    private _ref: ChangeDetectorRef) {
    this.platform = Capacitor.getPlatform();
    const mConfig = config.plugins && config.plugins.CapacitorSQLite ? config.plugins.CapacitorSQLite : null;

    if (this.platform === "android" && mConfig != null) {
      this.isBiometric = mConfig.androidBiometric && mConfig.androidBiometric.biometricAuth
        ? mConfig.androidBiometric.biometricAuth : false;
    }
    if (this.platform === "ios" && mConfig != null) {
      this.isBiometric = mConfig.iosBiometric && mConfig.iosBiometric.biometricAuth
        ? mConfig.iosBiometric.biometricAuth : false;
    }
    console.log(`>>>>> in Home constructor ${this.isBiometric}`)
  }
  ionViewWillEnter() {
    this.exConn = this._detailService.getExistingConnection();
    this.exJson = this._detailService.getExportJson();

  }
  async ionViewDidEnter() {
    if (this.platform === "android" || this.platform === "ios") {
      this.native = true;
      console.log(`&&& platform ${this.platform}, native ${this.native}`)
      console.log(`&&& isBiometric: ${this.isBiometric}, isDisplay ${this.isDisplay}`)
      if (this.isBiometric && !this.isDisplay) {
        this.biometricListener = this._sqlite.sqlitePlugin.addListener('sqliteBiometricEvent', (info: any) => {
          console.log(`in sqliteBiometricEvent ${JSON.stringify(info)}`)
          if (info.result) {
            this.isDisplay = true;
            console.log(`in sqliteBiometricEvent this.isDisplay  ${this.isDisplay}`)
            this._ref.detectChanges();
          }
        });
      } else {
        this.isDisplay = true;
      }
    } else {
      this.isDisplay = true;
    }

  }
  ngOnDestroy() {
    if (this.native && this.isBiometric) {
      console.log("$$$$ in ngOnDestroy remove listener");
      this.biometricListener.remove();
    }
  }

}
