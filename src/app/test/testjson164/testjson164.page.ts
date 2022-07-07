import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';
import { schemaVersion1, dataVersion1, schemaVersion2, dataVersion2} from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson164',
  templateUrl: 'testjson164.page.html',
  styleUrls: ['testjson164.page.scss']
})
export class Testjson164Page implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;
  jsonObj: any;

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
      await this.runTest();
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } catch (err) {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log("$$$ runTest failed");
      await showAlert(err.message);
    }
  }


  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");

      // ************************************************
      // Import Full Version 1 Schema Issue#164
      // ************************************************
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(schemaVersion1));
      console.log(`>>>> after isJsonValid ${result.result}`)      
      if(!result.result) {
        return Promise.reject(new Error("IsJson failed"));
      }
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(schemaVersion1));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));

      // ************************************************
      // Create Sync Table and Date
      // ************************************************

      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("db-issue164", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-issue164 failed"));

      // open db testNew
      await db.open();
      console.log(">>>> create SYNC Table and Date")

      // create synchronization table 
      result = await db.createSyncTable();
      console.log(`>>>> createSyncTable result ${JSON.stringify(result)}`);
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      let syncDate: string = await db.getSyncDate();
      console.log(`>>>> getSyncTable syncDate ${syncDate}`);

      if(syncDate.length === 0) return Promise.reject(new Error("GetSyncDate failed"));

      // close the connection
      await this._sqlite.closeConnection("db-issue164"); 
      console.log("closeConnection Version 1")

      // ************************************************
      // Import Partial Version 1 Table data Issue#164
      // ************************************************

      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(dataVersion1));
      console.log(`>>>> after isJsonValid ${result.result}`)      
      if(!result.result) {
        return Promise.reject(new Error("IsJson failed"));
      }
      // partial import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(dataVersion1));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));
      db = await this._sqlite
      .createConnection("db-issue164", false,
                        "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-issue164 failed"));

      // open db testNew
      await db.open();

      // select all tables in db
      let query: string = "SELECT name FROM sqlite_master WHERE "
      query += "type='table' AND name NOT LIKE 'sync_table' "
      query += "AND name NOT LIKE '_temp_%' "
      query += "AND name NOT LIKE 'sqlite_%' "
      query += "ORDER BY rootpage DESC;";

      let ret = await db.query(query);
      if(ret.values.length !== 3 || ret.values[0].name !== "images" ||
                                    ret.values[1].name !== "messages" ||
                                    ret.values[2].name !== "users") {
        return Promise.reject(new Error("Query Tables Version1 failed"));
      }
      
      // close the connection
      await this._sqlite.closeConnection("db-issue164"); 

      // ************************************************
      // Import Full Version 2 Schema Issue#164
      // ************************************************
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(schemaVersion2));
      console.log(`>>>> after isJsonValid ${result.result}`)      
      if(!result.result) {
        return Promise.reject(new Error("IsJson failed"));
      }
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(schemaVersion2));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));

      db = await this._sqlite
          .createConnection("db-issue164", false,
                        "no-encryption", 2);
      if(db === null) return Promise.reject(new Error("CreateConnection db-issue164 failed"));

      // open db testNew
      await db.open();

      // create synchronization table 
      result = await db.createSyncTable();
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      syncDate = await db.getSyncDate();
      if(syncDate.length === 0) return Promise.reject(new Error("GetSyncDate failed"));

      // close the connection
      await this._sqlite.closeConnection("db-issue164"); 
      console.log("closeConnection Version 2")

      // ************************************************
      // Import Partial Version 2 Table data Issue#164
      // ************************************************

      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(dataVersion2));
      console.log(`>>>> after isJsonValid ${result.result}`)      
      if(!result.result) {
        return Promise.reject(new Error("IsJson failed"));
      }
      // partial import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(dataVersion2));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));
      db = await this._sqlite
      .createConnection("db-issue164", false,
                        "no-encryption", 2);
      if(db === null) return Promise.reject(new Error("CreateConnection db-issue164 failed"));

      // open db testNew
      await db.open();

      // select all tables in db
      query = "SELECT name FROM sqlite_master WHERE "
      query += "type='table' AND name NOT LIKE 'sync_table' "
      query += "AND name NOT LIKE '_temp_%' "
      query += "AND name NOT LIKE 'sqlite_%' "
      query += "ORDER BY rootpage DESC;";

      ret = await db.query(query);
      if(ret.values.length !== 2 || ret.values[0].name !== "messages" ||
                                    ret.values[1].name !== "users") {
        return Promise.reject(new Error("Query Tables Version2 failed"));
      }
      
      // close the connection
      await this._sqlite.closeConnection("db-issue164"); 


    } catch (err) {
      await this._sqlite.closeConnection("db-issue164"); 
      return Promise.reject(err);
    }
  

  }

}
