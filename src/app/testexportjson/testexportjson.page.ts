import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';

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
    // Initialize the CapacitorSQLite plugin
    console.log("%%%% in TestexportjsonPage this._sqlite " + 
                                                  this._sqlite)

    const result: boolean = await this.runTest();
    if(result) {
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } else {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log("$$$ runTest failed");
    }
  }


  async runTest(): Promise<boolean> {
    let result: any = await this._sqlite.echo("Hello World");
    console.log(" from Echo " + result.value);

    // ************************************************
    // Export Json Object from an Existing Database
    // ************************************************

    // create the connection to the database
    const db = await this._sqlite
                      .createConnection("db-from-json", false,
                                        "no-encryption", 1);
    if(db === null) return false;

    // open db testNew
    result = await db.open();
    if (!result.result) return false;

    // ************************************************
    // Full Export json
    // ************************************************
    let jsonObj: any = await db.exportToJson('full');
    
    console.log("$$$ jsonObj " + JSON.stringify(jsonObj))   
    // test Json object validity
    result = await this._sqlite
                          .isJsonValid(JSON.stringify(jsonObj.export));
    if(!result.result) {
      console.log(`isJsonValid: ${result.message}`);
      return false;
    }
    // ************************************************
    // Partial Export json
    // ************************************************
    result = await db.setSyncDate("2020-05-20T18:40:00.000Z");
    if(!result.result) {
      console.log(`setSyncDate: ${result.message}`);
      return false;
    }
    jsonObj = await db.exportToJson('partial');
    console.log("$$$ jsonObj " + JSON.stringify(jsonObj))   
    // test Json object validity
    result = await this._sqlite
                          .isJsonValid(JSON.stringify(jsonObj.export));
    if(!result.result) {
      console.log(`isJsonValid: ${result.message}`);
      return false;
    }
    if(jsonObj.export.tables.length != 3 || jsonObj.export.tables[0].name != 'users'
        || jsonObj.export.tables[1].name != 'messages' || jsonObj.export.tables[2].name != 'images' 
        || jsonObj.export.tables[0].values.length != 4 || jsonObj.export.tables[1].values.length != 3
        || jsonObj.export.tables[2].values.length != 1) {
      return false;
    }
    // close the connection
    result = await this._sqlite.closeConnection("db-from-json"); 
    if(!result.result) return false; 
    this._detailService.setExportJson(false);

    return true;
   }

}
