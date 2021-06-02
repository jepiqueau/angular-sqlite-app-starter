import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';

import { createSchema, twoUsers, twoTests } from '../utils/no-encryption-utils';
import { createSchemaContacts, setContacts } from '../utils/encrypted-set-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { dataToImport94 } from '../utils/import-json-utils';

@Component({
  selector: 'app-testchangesecuresecret',
  templateUrl: 'testchangesecuresecret.page.html',
  styleUrls: ['testchangesecuresecret.page.scss']
})
export class TestChangeSecureSecretPage implements AfterViewInit {
  detail: boolean = false;
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;
  showAlert: any;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {}

  async ngAfterViewInit() {
    this.showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    console.log("%%%% in TestChangeSecureSecretPage this._sqlite " + this._sqlite)
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
      let result: any = await this._sqlite.echo("Hello World");
      console.log(" from Echo " + result.value);
      var retDict: Map<string, any> = await this._sqlite.retrieveAllConnections();
      console.log(`$$$ number of connection before checkConnectionsConsistency: ${retDict.size}`)
      for (var conn in retDict) {
        console.log(`connection: ${conn}`)
      }
      await this._sqlite.changeEncryptionSecret('how million space by locate',
                                                'abbey clammy gird night test');

/*        await this._sqlite.changeEncryptionSecret('abbey clammy gird night test',
                                                  'how million space by locate');
*/
      // initialize the connection
      const db = await this._sqlite
                  .createConnection("testNew", false, "no-encryption", 1);
      console.log("db " + db)
      const db1 = await this._sqlite
                  .createConnection("testSet", true, "secret", 1);

      // open db testNew
      await db.open();

      // open db testSet
      await db1.open();

      // select all users in db
      let ret: any = await db.query("SELECT * FROM users;");
      if(ret.values.length !== 7) {
        return Promise.reject(new Error(`Query 1 users all failed ${ret.values.length}`));
      }

      // select users where age is NULL in db
      ret = await db.query("SELECT * FROM users WHERE age IS NULL;");
      if(ret.values.length !== 1 || ret.values[0].name !== "Bush") {
        return Promise.reject(new Error("Query 2 users where age is null failed"));
      }
      // select all test56 in db
      ret = await db.query("SELECT * FROM test56;");
      if(ret.values.length !== 6) {
        return Promise.reject(new Error("Query 3 test56 all failed"));
      }
      // select all contacts in db
      ret = await db1.query("SELECT * FROM contacts;");
      if(ret.values.length !== 4) {
        return Promise.reject(new Error("Query 4 contacts all failed"));
      }
      // create an encrypted database from json object
      let jsObj: any = dataToImport94;
      jsObj.database = "json-encrypted";
      jsObj.encrypted = true;
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsObj));                           
      if(!result.result) {
        console.log(`isJsonValid: ${result.message}`);
        return Promise.reject(new Error("IsJson failed"));
      }
      console.log("$$$ jsObj Json Object is valid $$$")
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(jsObj));    
      console.log(`full import result ${result.changes.changes}`);
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));
      // create the connection to the database
      const db3 = await this._sqlite
                        .createConnection("json-encrypted", true,
                                          "secret", 1);
      if(db3 === null) return Promise.reject(new Error("CreateConnection json-encrypted failed"));

      // open db json-encrypted
      await db3.open();

      // create synchronization table 
      result = await db3.createSyncTable();
      console.log(`after createSyncTable ${JSON.stringify(result)}` )
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      const syncDate: string = await db3.getSyncDate();
      console.log("$$ syncDate " + syncDate);
      if(syncDate.length === 0) return Promise.reject(new Error("GetSyncDate failed"));

      // select all reps in db
      ret = await db3.query("SELECT * FROM reps;");
      if(ret.values.length !== 3) {
        return Promise.reject(new Error("Query 5 reps all failed"));
      }
      ret = await this._sqlite.checkConnectionsConsistency();
      var retDict: Map<string, any> = await this._sqlite.retrieveAllConnections();
      console.log(`$$$ number of connection after checkConnectionsConsistency: ${retDict.size}`)
      for (var conn in retDict) {
        console.log(`connection: ${conn}`)
      }
      // close all connections
      await this._sqlite.closeAllConnections();
      
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
