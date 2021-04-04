import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { dataToImport102 } from '../utils/import-json-utils';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-testjson102',
  templateUrl: 'testjson102.page.html',
  styleUrls: ['testjson102.page.scss']
})
export class Testjson102Page implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _store: StorageService) {}

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    console.log("%%%% in Testjson102Page this._sqlite "/* + 
                                                  this._sqlite*/)

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
    /*
    let result: any = await this._sqlite.echo("Hello World");
    console.log(" from Echo " + result.value);

    // ************************************************
    // Import Json Object Issue#101
    // ************************************************

    // test Json object validity
    result = await this._sqlite
                          .isJsonValid(JSON.stringify(dataToImport102));
    if(!result.result) {
      console.log(`isJsonValid: ${result.message}`);
      return false;
    }
    console.log("$$$ dataToImport Json Object is valid $$$")
    // full import
    result = await this._sqlite
                        .importFromJson(JSON.stringify(dataToImport102));    
    console.log(`full import result ${result.changes.changes}`);
    if(result.changes.changes === -1 ) return false;

    // ************************************************
    // Export Json Object from an Existing Database
    // ************************************************

    // create the connection to the database
    const db = await this._sqlite
                      .createConnection("doublenote-db", false,
                                        "no-encryption", 1);
    if(db === null) return false;

    // open db testNew
    result = await db.open();
    if (!result.result) return false;

    // create synchronization table 
    result = await db.createSyncTable();
    console.log(`after createSyncTable ${JSON.stringify(result)}` )
    if (result.changes.changes < 0) return false;


    result = await db.getSyncDate();
    console.log(`after getSyncDate  ${JSON.stringify(result)}` )
    if(result.syncDate === 0) return false;
    console.log("$$ syncDate " + result.syncDate);

    // export json
    let jsonObj: any = await db.exportToJson('full');
    
    console.log(JSON.stringify(jsonObj.export));    
    // test Json object validity
    result = await this._sqlite
                          .isJsonValid(JSON.stringify(jsonObj.export));
    if(!result.result) {
      console.log(`isJsonValid: ${result.message}`);
      return false;
    }


    // close the connection
    result = await this._sqlite.closeConnection("doublenote-db"); 
    if(!result.result) return false; 
    this._detailService.setExportJson(false);
    return true;
  */
    const ret = await this._store.initializePlugin();
    console.log(">>>> in App  Store this.initPlugin " + JSON.stringify(ret))
      let result: any = await this._store.echo("Hello World from Store");
      console.log(" from Echo " + result.value);
      if( result.value === "Hello World from Store" ) {
        return true;
      } else {
        return false;
      }
  }

}
