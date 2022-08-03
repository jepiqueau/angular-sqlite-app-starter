import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';

import { createSchema, twoUsers, createSchemaArticles} from '../utils/test-json1-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { capSQLiteSet } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-testjson1extension',
  templateUrl: 'testjson1extension.page.html',
  styleUrls: ['testjson1extension.page.scss']
})
export class TestJson1ExtensionPage implements AfterViewInit {
  detail: boolean = false;
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;
  importListener: any;
  exportListener: any;
  dataArticles: any;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {}

  async ngAfterViewInit() {
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    try {
      const res = await this.loadJSON('assets/jsonFiles/test-json1.json');
      this.dataArticles = JSON.parse(res);
  
      await this.runTest();
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } catch (err) {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log(`$$$ runTest failed ${err.message}`);
      await showAlert(err.message);
    }
  }


  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");

       // initialize the connection
      let db: SQLiteDBConnection;
      if((await this._sqlite.isConnection("testJSON1")).result) {
        db = await this._sqlite.retrieveConnection("testJSON1");
      } else 
        db = await this._sqlite
                  .createConnection("testJSON1", false, "no-encryption", 1);
      // check if the databases exist 
      // and delete it for multiple successive tests
      await deleteDatabase(db);

      // open db testNew
      await db.open();

      // create tables in db
      let ret: any = await db.execute(createSchema,false);
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }

      // create synchronization table 
      ret = await db.createSyncTable();
      
      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      // add first users in db
      ret = await db.execute(twoUsers);
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute 2 users failed"));
      }
      // select all users in db
      ret = await db.query("SELECT * FROM users;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Jones" ||
                                    ret.values[1].name !== "Jeep") {
        return Promise.reject(new Error("Query 1 users failed"));
      }
      ret = await db.query("SELECT json_extract(users.phone, '$.cell') FROM users;");
      if(ret.values.length !== 2 
        || ret.values[0]["json_extract(users.phone, '$.cell')"] !== "+34712345678"
        || ret.values[1]["json_extract(users.phone, '$.cell')"] !== "+33912345678"
      ) {
        return Promise.reject(new Error("Query User's cell phone failed"));
      }
      console.log(`ret.values ${JSON.stringify(ret.values)}`);
      console.log(`ret.values[0]  ${ret.values[0]["json_extract(users.phone, '$.cell')"]}}`);
      console.log(`ret.values[1]  ${ret.values[1]["json_extract(users.phone, '$.cell')"]}`);

      ret = await db.query(`SELECT DISTINCT users.name FROM users,
            json_each(users.phone) WHERE json_each.value LIKE '+33%';`);
      if(ret.values.length !== 1 || ret.values[0].name !== "Jeep") {
        return Promise.reject(new Error("Query Users where Phone starts with +33 failed"));
      }
      ret = await db.run(`UPDATE users SET phone = json_replace(users.phone, '$.cell', "+33612567834") WHERE users.name = "Jeep";`,[]);
      /*,
            json_replace(users.phone, '$.cell', "+33612567834");*/
      console.log(`ret ${JSON.stringify(ret)}`);
      ret = await db.query("SELECT json_extract(users.phone, '$.cell') FROM users WHERE users.name = 'Jeep';");
      if(ret.values.length !== 1 
        || ret.values[0]["json_extract(users.phone, '$.cell')"] !== "+33612567834"
      ) {
        return Promise.reject(new Error("Query User's cell phone failed"));
      }
      ret = await db.query("SELECT json_extract(users.phone, '$.cell') FROM users;");
      if(ret.values.length !== 2 
        || ret.values[0]["json_extract(users.phone, '$.cell')"] !== "+34712345678"
        || ret.values[1]["json_extract(users.phone, '$.cell')"] !== "+33612567834"
      ) {
        return Promise.reject(new Error("Query User's cell phone failed"));
      }
      
      result = await this._sqlite.isConnection("testJSON1");
      if(result.result) {
        // close the connection testJSON1
        await this._sqlite.closeConnection("testJSON1");      
      }

      // test Articles
      // initialize the connection
      let db1: SQLiteDBConnection;
      if((await this._sqlite.isConnection("Articles")).result) {
        db1 = await this._sqlite.retrieveConnection("Articles");
      } else 
        db1 = await this._sqlite
                  .createConnection("Articles", false, "no-encryption", 1);
        console.log(`after create Connection Articles`)
      // check if the databases exist 
      // and delete it for multiple successive tests
      await deleteDatabase(db1);

      // open db testNew
      await db1.open();

      // create tables in db1
      ret = await db1.execute(createSchemaArticles,false);
      console.log(`createSchemaArticles ret.changes.changes ${ret.changes.changes}`)
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchemaArticles failed"));
      }

      // create synchronization table 
      ret = await db1.createSyncTable();
      console.log(`createSyncTable JSON.stringify(ret) ${JSON.stringify(ret)}`)
      
      // set the synchronization date
      const syncDate1 = "2021-08-12T08:30:25.000Z";
      await db1.setSyncDate(syncDate1);
      console.log(`after setSyncDate `)

      for (const data of this.dataArticles.articles) {
        let stmt1 = `INSERT INTO articles (data) VALUES (json('${JSON.stringify(data)}'));`;
        console.log(`stmt1 ${stmt1}`)
        ret = await db1.run(stmt1,[]);
        console.log(`run ret.changes.changes ${ret.changes.changes}`)
      }
      ret = await db1.query("SELECT json_extract(articles.data, '$.title') FROM articles;");

      let stmt = "SELECT json_extract(articles.data, '$.title') AS title ";
      stmt += "FROM articles ORDER BY json_extract(articles.data, '$.title') LIMIT 5;";
      ret = await db1.query(stmt);
      if(ret.values.length !== 5 
        || ret.values[0].title.substring(0,17) !== "A Tour of Tagging"
        || ret.values[1].title.substring(0,17) !== "Alternative Redis"
        || ret.values[2].title.substring(0,17) !== "Building the SQLi"
        || ret.values[3].title.substring(0,17) !== "Connor Thomas Lei"
        || ret.values[4].title.substring(0,17) !== "Extending SQLite "

      ) {
        return Promise.reject(new Error("Query User's cell phone failed"));
      }
      result = await this._sqlite.isConnection("Articles");
      if(result.result) {
        // close the connection tArticles
        await this._sqlite.closeConnection("Articles");      
      }
    
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
  private async loadJSON(jsonFileName: string): Promise<string> {
    return new Promise ((resolve,reject) => {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', jsonFileName, true);
      xobj.onerror = () => {
        reject(`LoadJSON: failed`);
      }

      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        resolve(xobj.responseText);
        }
      };
      xobj.send(null);
    });
  }

}
