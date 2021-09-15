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
          const jeepSqliteEl = document.querySelector('jeep-sqlite');
          if(jeepSqliteEl != null) {
            console.log(`isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`)
            console.log(`$$ jeepSqliteEl is defined}`);
          } else {
            console.log('$$ jeepSqliteEl is null');
          }
        }
        try {
          console.log(`going to create a connection`)
          const db = await this.sqlite.createConnection("db_issue9",false,"no-encryption", 1);
          console.log(`db ${JSON.stringify(db)}`)
          await db.open();
          console.log(`after db.open`)
          let query = `
          CREATE TABLE IF NOT EXISTS test (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL
          );
          `
          console.log(`query ${query}`)

          const res: any = await db.execute(query);
          console.log(`res: ${JSON.stringify(res)}`)
          await db.close();
          console.log(`after db.close`)
        } catch (err) {
          console.log(`Error: ${err}`);
          this.initPlugin = false;
        }

        console.log(">>>> in App  this.initPlugin " + this.initPlugin)
      });
    });
  }

}
