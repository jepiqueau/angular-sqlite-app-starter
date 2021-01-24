import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { createSchemaVersion1, twoUsers, createSchemaVersion2,
          setArrayVersion2, userMessages } from '../utils/upgrade-version-utils';
import { deleteDatabase } from '../utils/db-utils';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
@Component({
  selector: 'app-testupgradeversion',
  templateUrl: 'testupgradeversion.page.html',
  styleUrls: ['testupgradeversion.page.scss']
})
export class TestupgradeversionPage implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
//    this.initPlugin = await this._sqlite.initializePlugin();
    console.log("%%%% in TestupgradeversionPage this._sqlite " + this._sqlite)
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
    // Create Database Version 1
    // ************************************************

    // initialize the connection for Database Version 1
    let db: SQLiteDBConnection = await this._sqlite
                .createConnection("test-updversion", false,
                                  "no-encryption", 1);
    // check if the databases exist 
    // and delete it for multiple successive tests
    let ret: any = await deleteDatabase(db);

    // open db test-updversion
    ret = await db.open();
    if (!ret.result) {
      return false;
    }

    // create tables in db
    ret = await db.execute(createSchemaVersion1);
    console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
    if (ret.changes.changes < 0) {
      return false;
    }

    // add two users in db
    ret = await db.execute(twoUsers);
    if (ret.changes.changes !== 2) {
      return false;
    }
    // select all users in db
    ret = await db.query("SELECT * FROM users;");
    if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                  ret.values[1].name !== "Jones") {
      return false;
    }
    // select users where company is NULL in db
    ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
    if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                  ret.values[1].name !== "Jones") {
      return false;
    }
    // select users where size is NULL in db
    ret = await db.query("SELECT * FROM users WHERE size IS NULL;");
    if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                  ret.values[1].name !== "Jones") {
      return false;
    }
    // close db test-updversion
    ret = await db.close();
    if (!ret.result) {
      return false;
    }
    // close connection to test-updversion
    ret = await this._sqlite.closeConnection("test-updversion"); 
    if(!ret.result) {
      return false; 
    }
        
    // ************************************************
    // Create Database Version 2
    // ************************************************

    // set the upgrade statement

    ret = await this._sqlite.addUpgradeStatement("test-updversion",
    1, 2, createSchemaVersion2, setArrayVersion2);     
    console.log("*** addUpgradeStatement ret " + ret.result + " ***")
    if(!ret.result) {
      console.log("*** Error: addUpgradeStatement failed");
      return false;
    }

    // initialize the connection for Database Version 2
    db = await this._sqlite
                .createConnection("test-updversion", false,
                "no-encryption", 2);
    // open db test-updversion
    ret = await db.open();
    if (!ret.result) {
      return false;
    }
    // select all user's country in db
    ret = await db.query("SELECT country FROM users;");
    if(ret.values.length !== 2 ||
        ret.values[0].country !== "United Kingdom" ||
        ret.values[1].country !== "Australia") {
      return false;
    }
    // select all messages for user 1
    ret = await db.query(userMessages,["1"]);
    if(ret.values.length !== 2 || 
      ret.values[0].name !== "Whiteley" ||
      ret.values[0].title !== "test message 1" ||
      ret.values[1].name !== "Whiteley" ||
      ret.values[1].title !== "test message 3") {
      return false;
    }
    // select all messages for user 2
    ret = await db.query(userMessages,["2"]);
    if(ret.values.length !== 1 || 
      ret.values[0].name !== "Jones" ||
      ret.values[0].title !== "test message 2") {
      return false;   
    }
    // close connection to test-updversion
    ret = await this._sqlite.closeConnection("test-updversion"); 
    if(!ret.result) {
      return false; 
    } else {
      return true;
    }

  }

}
