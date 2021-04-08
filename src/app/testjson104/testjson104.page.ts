import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { dataToImport104 } from '../utils/import-json-utils';

@Component({
  selector: 'app-testjson104',
  templateUrl: 'testjson104.page.html',
  styleUrls: ['testjson104.page.scss']
})
export class Testjson104Page implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    console.log("%%%% in Testjson104Page this._sqlite "/* + 
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
    
    let result: any = await this._sqlite.echo("Hello World");
    console.log(" from Echo " + result.value);

    // ************************************************
    // Import Json Object Issue#101
    // ************************************************

    // test Json object validity
    result = await this._sqlite
                          .isJsonValid(JSON.stringify(dataToImport104));
    if(!result.result) {
      console.log(`isJsonValid: ${result.message}`);
      return false;
    }
    console.log("$$$ dataToImport Json Object is valid $$$")
    // full import
    result = await this._sqlite
                        .importFromJson(JSON.stringify(dataToImport104));    
    console.log(`full import result ${result.changes.changes}`);
    if(result.changes.changes === -1 ) return false;

    // ************************************************
    // Load Data
    // ************************************************

    // create the connection to the database
    const db = await this._sqlite
                      .createConnection("products104-db", false,
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


    // add one category with statement and values 
    let sqlcmd: string = "INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)";
    let values: Array<any> =  ["23124fcd-e585-4f07-ae30-38d33020f78c", "Valves", "Valves blablabla..."];
    let ret = await db.run(sqlcmd,values);
    console.log(`ret.changes.lastId ${ret.changes.lastId}`)
    if(ret.changes.lastId !== 1) {
      return false;
    }
    // add one product 
    sqlcmd = "INSERT OR IGNORE INTO products (id, categoryId, expiredAt) VALUES (?, ?, ?)";
    values = ["3e54b235-951b-4617-9479-e0ca10a79012", "23124fcd-e585-4f07-ae30-38d33020f78c", "2021-06-04T14:48:00.000Z"];
    ret = await db.run(sqlcmd,values);
    console.log(`ret.changes.lastId ${ret.changes.lastId}`)
    if(ret.changes.lastId !== 1) {
      return false;
    }

    // update expired date
    sqlcmd = "UPDATE products SET expiredAt = ? WHERE id = ?";
    values = ['2022-10-05T14:48:00.000Z', '3e54b235-951b-4617-9479-e0ca10a79012'];
    ret = await db.run(sqlcmd,values);
    if(ret.changes.lastId !== 1) {
      return false;
    }


    // close the connection
    result = await this._sqlite.closeConnection("products104-db"); 
    if(!result.result) return false; 
    return true;
  
  }

}
