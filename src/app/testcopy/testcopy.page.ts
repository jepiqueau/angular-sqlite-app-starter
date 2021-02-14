import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { createSchema82 } from '../utils/no-encryption-utils';

@Component({
  selector: 'app-testcopy',
  templateUrl: 'testcopy.page.html',
  styleUrls: ['testcopy.page.scss']
})
export class TestCopyPage implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {
                this.platform = this._sqlite.platform;
              }

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    console.log("%%%% in TestCopyPage this._sqlite " + 
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
    // Test isConnection, isDatabase, isTable,
    //      getDatabaseList, addSQLiteSuffix
    // ************************************************

    result = await this._sqlite.isConnection("testcopy");
    if(result.result) return false;    
    // test get the Database List
    result = await this._sqlite.getDatabaseList();
    console.log(`test get Database List: ${JSON.stringify(result)}`)
    result = await this._sqlite.addSQLiteSuffix();
    if(!result.result) return false;
    result = await this._sqlite.isConnection("testfromfile");
    if(result.result) return false;
    // test if the cordova databases where not at the "default" directory
    // here we assume that they were stored at "Files/Databases"
    let directory: string =  "Files/Databases"
    if(this.platform === "ios") directory = "Applications/Files/Databases"
    if(this.platform === "android" ) directory = "files/databases";  
    result = await this._sqlite.addSQLiteSuffix(directory);
    if(!result.result) return false;

    // check if database "testcopy" exists
    result = await this._sqlite.isDatabase("testcopy");
    if(!result.result) return false;
    // check if database "testfromfile" exists
    result = await this._sqlite.isDatabase("testfromfile");
    if(!result.result) return false;

    // ************************************************
    // Query the database
    // ************************************************

    // create the connection to the database
    const db = await this._sqlite
                      .createConnection("testcopy", false,
                                        "no-encryption", 1);
    if(db === null) return false;

    // open db testcopy
    result = await db.open();
    if (!result.result) return false;
    // 
    // select all users in db
    result  = await db.query("SELECT * FROM users;");
    console.log(`$$$ select users ${result.values.length}`)
    if(result .values.length !== 7 || result .values[0].name !== "Whiteley"
      || result .values[1].name !== "Jones"
      || result .values[2].name !== "Simpson"
      || result .values[3].name !== "Brown"
      || result .values[4].name !== "Jackson"
      || result .values[5].name !== "Kennedy"
      || result .values[6].name !== "Bush"
      ) {
      return false;
    }

    // check if the table "users" exists
    result = await db.isTable("users");
    console.log(`$$$ isTable users ${result.result}`)
    if(!result.result) return false;

    // check if the table "messages" exists
    result = await db.isTable("messages");
    console.log(`$$$ isTable messages ${result.result}`)
    if(!result.result) return false;

    // check if the table "images" exists
    result = await db.isTable("images");
    console.log(`$$$ isTable images ${result.result}`)
    if(!result.result) return false;

    // check if the table "foo" exists
    result = await db.isTable("foo");
    console.log(`$$$ isTable foo ${result.result}`)
    if(result.result) return false;

    // delete old databases
    result = await this._sqlite.deleteOldDatabases();
    if(!result.result) return false;

    // create the connection to the database "testfromfile"
    const db1 = await this._sqlite
                      .createConnection("testfromfile", false,
                                        "no-encryption", 1);
    if(db1 === null) return false;
    // open db testcopy
    result = await db1.open();
    if (!result.result) return false;
    // check if the table "users" exists
    result = await db1.isTable("users");
    if(!result.result) return false;
    // select all users in db
    result  = await db1.query("SELECT * FROM users;");
    if(result .values.length !== 7 || result .values[0].name !== "Whiteley"
      || result .values[1].name !== "Jones"
      || result .values[2].name !== "Simpson"
      || result .values[3].name !== "Brown"
      || result .values[4].name !== "Jackson"
      || result .values[5].name !== "Kennedy"
      || result .values[6].name !== "Bush"
      ) {
      return false;
    }
    // delete old databases
    result = await this._sqlite.deleteOldDatabases(directory);
    if(!result.result) return false;

    // initialize the connection for issue#82
    const db2 = await this._sqlite
                .createConnection("test-issue82", false, "no-encryption", 1);
    // open db2 test-issue82
    result = await db2.open();
    if (!result.result) {
      return false;
    }

    // create tables in db2
    result = await db2.execute(createSchema82);
    console.log('$$$ result.changes.changes in db ' + result.changes.changes)
    if (result.changes.changes < 0) {
      return false;
    }
    // select all users in db
    result = await db2.query("SELECT * FROM drawings WHERE congregationId = '494f7713-4dfe-4a92-b1a9-75aadcd71022';");
    console.log(`$$$ issue82 ${JSON.stringify(result)}`)
    if(result.values.length !== 0) {     
      return false;
    }

    // close the connection "testcopy"
    result = await this._sqlite.closeConnection("testcopy"); 
    if(!result.result) return false; 
    this._detailService.setExportJson(false);
    // close the connection "testfromfile"
    result = await this._sqlite.closeConnection("testfromfile"); 
    if(!result.result) return false; 

    // close the connection "test-issue82"
    result = await this._sqlite.closeConnection("test-issue82"); 
    if(!result.result) return false; 

    return true;
    

  }

}
