import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';
import { dataToImport231, dataToImportPartial231 } from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson231',
  templateUrl: 'testjson231.page.html',
  styleUrls: ['testjson231.page.scss']
})
export class Testjson231Page implements AfterViewInit {
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
    try{
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
      // Import Json Object Issue#231
      // ************************************************
      // test Full Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(dataToImport231));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid Full failed"));
      }
      // full import create schema only
      result = await this._sqlite
                          .importFromJson(JSON.stringify(dataToImport231));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));

      // test Partial Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(dataToImportPartial231));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid Partial failed"));
      }
      // partial import load the data
      result = await this._sqlite
                          .importFromJson(JSON.stringify(dataToImportPartial231));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'partial' failed"));

      // create the connection to the database
      const db = await this._sqlite
                        .createConnection("db-from-json231", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-from-json231 failed"));

      // open db db-from-json231
      await db.open();

      // select all countries in db
      let ret: any = await db.query("SELECT * FROM countries;");
      if(ret.values.length !== 3 || ret.values[0].name !== "Afghanistan" ||
                                    ret.values[1].name !== "Albania"||
                                    ret.values[2].name !== "Algeria") {
        return Promise.reject(new Error("Query countries failed"));
      }
      // select all customers in db
      ret = await db.query("SELECT * FROM customers ORDER BY email;");
      console.log(`>>>> ret: ${JSON.stringify(ret)}`)
      if(ret.values.length !== 2 || ret.values[0]["last_name"] !== "Brown" ||
                                    ret.values[1]["last_name"] !== "Jones") {
        return Promise.reject(new Error("Query customers failed"));
      }
      // ************************************************
      // Export Json Object from an Existing Database
      // ************************************************



      // export json full
      let jsonObj: any = await db.exportToJson('full');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }

      // export json partial
/*      jsonObj = await db.exportToJson('partial');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'partial' failed"));
      }
*/
      // close the connection
      await this._sqlite.closeConnection("db-from-json231"); 

      return Promise.resolve();
    } catch (err) {
     // close the connection
     await this._sqlite.closeConnection("db-from-json231"); 
     return Promise.reject(err);
    }
  

  }

}
