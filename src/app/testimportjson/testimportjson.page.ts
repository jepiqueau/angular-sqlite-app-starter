import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { dataToImport, partialImport1, dataToImport2 } from '../utils/import-json-utils';
@Component({
  selector: 'app-testimportjson',
  templateUrl: 'testimportjson.page.html',
  styleUrls: ['testimportjson.page.scss']
})
export class TestimportjsonPage implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

//1234567890123456789012345678901234567890123456789012345678901234567890
  constructor(private _sqlite: SQLiteService,
                    private _detailService: DetailService) {}

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    console.log("%%%% in TestimportjsonPage this._sqlite " + 
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
    // Create Database from imported Json
    // ************************************************

    // test Json object validity
    result = await this._sqlite
                          .isJsonValid(JSON.stringify(dataToImport));
    if(!result.result) {
      console.log(`isJsonValid: ${result.message}`);
      return false;
    }
    console.log("$$$ dataToImport Json Object is valid $$$")
    // full import
    result = await this._sqlite
                        .importFromJson(JSON.stringify(dataToImport));    
    console.log(`full import result ${result.changes.changes}`);
    if(result.changes.changes === -1 ) return false;


    // create the connection to the database
    let db = await this._sqlite
                      .createConnection("db-from-json", false,
                                        "no-encryption", 1);
    if(db === null) return false;

    // open db "db-from-json"
    result = await db.open();
    if (!result.result) return false;

    // create synchronization table 
    result = await db.createSyncTable();
    if (result.changes.changes < 0) return false;


    result = await db.getSyncDate();
    if(result.syncDate === 0) return false;
    console.log("$$ syncDate " + result.syncDate);

    // select all users in db
    result = await db.query("SELECT * FROM users;");
    if(result.values.length !== 4 || 
                  result.values[0].name !== "Whiteley" ||
                  result.values[1].name !== "Jones" ||
                  result.values[2].name !== "Simpson" ||
                  result.values[3].name !== "Brown"  ) {
      return false;
    }

    // close the connection
    result = await this._sqlite.closeConnection("db-from-json"); 
    if(!result.result) return false; 

    // partial import
    result = await this._sqlite
                      .importFromJson(JSON.stringify(partialImport1));
    console.log(`partial import result ${result.changes.changes}`);
    if(result.changes.changes === -1 ) return false;
    // create the connection to the database
    db = await this._sqlite
                      .createConnection("db-from-json", false,
                                        "no-encryption", 1);
    if(db === null) return false;

    // open db "db-from-json"
    result = await db.open();
    if (!result.result) return false;

    result = await db.getSyncDate();
    if(result.syncDate === 0) return false;
    console.log("$$ syncDate " + result.syncDate);

    // select all users in db
    result = await db.query("SELECT * FROM users;");
    console.log(`result.values ${JSON.stringify(result)}`)
    if(result.values.length !== 6 || 
                  result.values[0].name !== "Whiteley" ||
                  result.values[1].name !== "Jones" ||
                  result.values[2].name !== "Simpson" ||
                  result.values[3].name !== "Brown" ||
                  result.values[4].name !== "Addington" ||
                  result.values[5].name !== "Bannister" ) {
      return false;
    }
    // select all messages in db
    result = await db.query("SELECT * FROM messages;");
    console.log(`result.values ${JSON.stringify(result)}`)
    if(result.values.length !== 4|| 
                  result.values[0].title !== "test post 1" ||
                  result.values[1].title !== "test post 2" ||
                  result.values[2].title !== "test post 3" ||
                  result.values[3].title !== "test post 4" ) {
      return false;
    }


    // select all images in db
    result = await db.query("SELECT * FROM images;");
    console.log(`result.values ${JSON.stringify(result)}`)
    if(result.values.length !== 2 || 
                  result.values[0].name !== "feather" ||
                  result.values[1].name !== "meowth" ) {
      return false;
    }

    // close the connection
    result = await this._sqlite.closeConnection("db-from-json"); 
    console.log(`result after closeConnection ${JSON.stringify(result)}`)
    if(!result.result) return false; 

    this._detailService.setExportJson(true);
    return true;

  }

}
