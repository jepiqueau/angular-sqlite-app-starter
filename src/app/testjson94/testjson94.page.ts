import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { dataToImport94 } from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson94',
  templateUrl: 'testjson94.page.html',
  styleUrls: ['testjson94.page.scss']
})
export class Testjson94Page implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {}

  async ngAfterViewInit() {
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    // Initialize the CapacitorSQLite plugin
    console.log("%%%% in Testjson94Page this._sqlite " + 
                                                  this._sqlite)
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
      console.log(" from Echo " + result.value);

      // ************************************************
      // Import Json Object Issue#94
      // ************************************************
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(dataToImport94));
      if(!result.result) {
        console.log(`isJsonValid: ${result.message}`);
        return Promise.reject(new Error("IsJson failed"));
      }
      console.log("$$$ dataToImport Json Object is valid $$$")
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(dataToImport94));    
      console.log(`full import result ${result.changes.changes}`);
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));

      // ************************************************
      // Export Json Object from an Existing Database
      // ************************************************

      // create the connection to the database
      const db = await this._sqlite
                        .createConnection("db-from-json94", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-from-json94 failed"));

      // open db testNew
      await db.open();

      // create synchronization table 
      result = await db.createSyncTable();
      console.log(`after createSyncTable ${JSON.stringify(result)}` )
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      const syncDate: string = await db.getSyncDate();
      console.log("$$ syncDate " + syncDate);
      if(syncDate.length === 0) return Promise.reject(new Error("GetSyncDate failed"));

      // export json
      let jsonObj: any = await db.exportToJson('full');
      
      console.log(JSON.stringify(jsonObj.export));    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }
      // close the connection
      await this._sqlite.closeConnection("db-from-json94"); 
      this._detailService.setExportJson(false);

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
