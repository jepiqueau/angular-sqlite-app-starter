
import { SQLiteService } from './sqlite.service';
import { DetailService } from './detail.service';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Injectable()
export class InitializeSqliteService {

  constructor(private platform: Platform,
    private sqlite: SQLiteService,
    private detail: DetailService) {
  }

  async initializeApp() {
    await this.platform.ready().then(async () => {
      console.log('platform is ready boys')
      this.detail.setExistingConnection(false);
      this.detail.setExportJson(false);
      this.platform.backButton.subscribeWithPriority(
        666666, () => {
          App.exitApp();
        });

      await this.sqlite.initializePlugin().then(async (ret) => {
        try {
          console.log(`going to create a connection`)
          const db = await this.sqlite.createConnection("db_issue94", false, "no-encryption", 1);
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
          await this.sqlite.closeConnection("db_issue94");
          console.log(`after closeConnection`)
        } catch (err) {
          console.error(`Error: ${err}`);
        }

        console.log(">>>> in App  this.initPlugin " + ret)
      });
    });
  }

}
