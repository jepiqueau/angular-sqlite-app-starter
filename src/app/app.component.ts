import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SQLiteService } from './services/sqlite.service';
import { DetailService } from './services/detail.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private initPlugin: boolean;
  public isWeb: boolean = false;
  constructor(
    private platform: Platform,
    private sqlite: SQLiteService,
    private detail: DetailService 
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.detail.setExistingConnection(false);
      this.detail.setExportJson(false);
      this.sqlite.initializePlugin().then(async (ret) => {
        this.initPlugin = ret;
        const p: string = this.sqlite.platform;
        console.log(`plaform ${p}`);
        if( p === "web") {
          this.isWeb = true;
          await customElements.whenDefined('jeep-sqlite');
        }
          console.log(">>>> in App  this.initPlugin " + this.initPlugin)
      });
    });
  }

}
