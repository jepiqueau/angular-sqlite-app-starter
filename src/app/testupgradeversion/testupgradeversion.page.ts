import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { createSchemaVersion1, twoUsers, createSchemaVersion2,
          setArrayVersion2, userMessages } from '../utils/upgrade-version-utils';
import { deleteDatabase } from '../utils/db-utils';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Dialog } from '@capacitor/dialog';

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
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    console.log("%%%% in TestupgradeversionPage this._sqlite " + this._sqlite)
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
      // Create Database Version 1
      // ************************************************

      // initialize the connection for Database Version 1
      let db: SQLiteDBConnection = await this._sqlite
                  .createConnection("test-updversion", false,
                                    "no-encryption", 1);
      // check if the databases exist 
      // and delete it for multiple successive tests
      await deleteDatabase(db);

      // open db test-updversion
      await db.open();

      // create tables in db
      let ret: any = await db.execute(createSchemaVersion1);
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchemaVersion1 failed"));
      }

      // add two users in db
      ret = await db.execute(twoUsers);
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute twoUsers failed"));
      }
      // select all users in db
      ret = await db.query("SELECT * FROM users;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query 2 Users failed"));
      }
      // select users where company is NULL in db
      ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query 2 Users where company is null failed"));
      }
      // select users where size is NULL in db
      ret = await db.query("SELECT * FROM users WHERE size IS NULL;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query 2 Users where size is null failed"));
      }
      // close db test-updversion
      await db.close();
      // close connection to test-updversion
      await this._sqlite.closeConnection("test-updversion"); 
          
      // ************************************************
      // Create Database Version 2
      // ************************************************

      // set the upgrade statement

      await this._sqlite.addUpgradeStatement("test-updversion",
      1, 2, createSchemaVersion2, setArrayVersion2);     
      console.log("*** addUpgradeStatement ret " + ret.result + " ***")

      // initialize the connection for Database Version 2
      db = await this._sqlite
                  .createConnection("test-updversion", false,
                  "no-encryption", 2);
      // open db test-updversion
      await db.open();
      // select all user's country in db
      ret = await db.query("SELECT country FROM users;");
      if(ret.values.length !== 2 ||
          ret.values[0].country !== "United Kingdom" ||
          ret.values[1].country !== "Australia") {
        return Promise.reject(new Error("Query 2 Users Version 2 failed"));
      }
      // select all messages for user 1
      ret = await db.query(userMessages,["1"]);
      if(ret.values.length !== 2 || 
        ret.values[0].name !== "Whiteley" ||
        ret.values[0].title !== "test message 1" ||
        ret.values[1].name !== "Whiteley" ||
        ret.values[1].title !== "test message 3") {
        return Promise.reject(new Error("Query 2 Messages Version 2 failed"));
      }
      // select all messages for user 2
      ret = await db.query(userMessages,["2"]);
      if(ret.values.length !== 1 || 
        ret.values[0].name !== "Jones" ||
        ret.values[0].title !== "test message 2") {
        return Promise.reject(new Error("Query 1 Messages for Users 2 Version 2 failed"));  
      }
      // close connection to test-updversion
      await this._sqlite.closeConnection("test-updversion"); 
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
