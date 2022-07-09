import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';
import { dataToImport59 } from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson97',
  templateUrl: 'testjson97.page.html',
  styleUrls: ['testjson97.page.scss']
})
export class Testjson97Page implements AfterViewInit {
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
      // Import Json Object Issue#97
      // ************************************************
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(dataToImport59));
      if(!result.result) {
        return Promise.reject(new Error("IsJson failed"));
      }
      
      const dataToImport97 = JSON.parse(JSON.stringify(dataToImport59));
      dataToImport97.database = "db-from-json97";
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(dataToImport97));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));

      // ************************************************
      // Export Json Object from an Existing Database
      // ************************************************

      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("db-from-json97", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-from-json97 failed"));

      // open db testNew
      await db.open();

      // create synchronization table 
      result = await db.createSyncTable();
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      const syncDate: string = await db.getSyncDate();
      if(syncDate.length === 0) return Promise.reject(new Error("GetSyncDate failed"));

      // export json
      this.jsonObj= await db.exportToJson('full');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(this.jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }
      await db.close();

      // delete the database before importing the export object
      await db.delete();

      // test if database exists
      result = await this._sqlite.isDatabase("db-from-json97");
      if(result.result) {
        return Promise.reject(new Error("Database db-from-json97 still exists after delete"));
      }

      // *********************************
      // Import the Exported Json Object
      // *********************************
      // test if connection exists
      result = await this._sqlite.isConnection("db-from-json97");
      if(result.result) {
        // close the connection
        await this._sqlite.closeConnection("db-from-json97"); 
      }
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(this.jsonObj.export));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));;

      // create the connection to the database
      db = await this._sqlite
                        .createConnection("db-from-json97", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-from-json97 failed"));

      // open db testNew
      await db.open();
      // create synchronization table 
      result = await db.createSyncTable();
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));
      // Set the Synchronization Date
      const d = new Date();    
      await db.setSyncDate(d.toISOString());
      // select all customers in db
      result = await db.query("SELECT * FROM customers;");
      if(result.values.length !== 2 || 
                    result.values[0].last_name !== "Jones" ||
                    result.values[1].last_name !== "Brown"  ) {
        return Promise.reject(new Error("Query 2 Customers failed"));
      }

      // close the connection
      await this._sqlite.closeConnection("db-from-json97"); 

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  

  }

}
