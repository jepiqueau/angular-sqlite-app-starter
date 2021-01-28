import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testexportjson',
  templateUrl: 'testexportjson.page.html',
  styleUrls: ['testexportjson.page.scss']
})
export class TestexportjsonPage implements AfterViewInit {
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
    console.log("%%%% in TestexportjsonPage this._sqlite " + 
                                                  this._sqlite)

    try {
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
      console.log(" from Echo " + result.value);

      // ************************************************
      // Export Json Object from an Existing Database
      // ************************************************

      // create the connection to the database
      const db = await this._sqlite
                        .createConnection("db-from-json", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-from-json failed"));

      // open db testNew
      await db.open();

      // ************************************************
      // Full Export json
      // ************************************************
      let jsonObj: any = await db.exportToJson('full');
      
      console.log("$$$ jsonObj " + JSON.stringify(jsonObj))   
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid 'full' export failed "));
      }
      // ************************************************
      // Partial Export json
      // ************************************************
      await db.setSyncDate("2020-05-20T18:40:00.000Z");
      jsonObj = await db.exportToJson('partial');
      console.log("$$$ jsonObj " + JSON.stringify(jsonObj))   
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid 'partial' export failed "));
      }
      if(jsonObj.export.tables.length != 3 || jsonObj.export.tables[0].name != 'users'
          || jsonObj.export.tables[1].name != 'messages' || jsonObj.export.tables[2].name != 'images' 
          || jsonObj.export.tables[0].values.length != 4 || jsonObj.export.tables[1].values.length != 3
          || jsonObj.export.tables[2].values.length != 1) {
        return Promise.reject(new Error("IsJsonValid 'partial' export failed: No 3 tables"));
      }
      // close the connection
      await this._sqlite.closeConnection("db-from-json"); 
      this._detailService.setExportJson(false);

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }

  }

}
