import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { createSchema82 } from '../utils/no-encryption-utils';
import { Dialog } from '@capacitor/dialog';

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
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    // Initialize the CapacitorSQLite plugin
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

      // ************************************************
      // Test isConnection, isDatabase, isTable,
      //      getDatabaseList, addSQLiteSuffix
      // ************************************************

      result = await this._sqlite.isConnection("testcopy");
      if(result.result) {
        return Promise.reject(new Error("Connection 'testcopy' already exists"));
      }    
      // test get the Database List
      result = await this._sqlite.getDatabaseList();
      console.log(`test get Database List: ${JSON.stringify(result)}`)

      await this._sqlite.addSQLiteSuffix();
      result = await this._sqlite.isConnection("testfromfile");
      if(result.result) {
        return Promise.reject(new Error("Connection 'testfromfile' already exists"));
      }    
      // test if the cordova databases where not at the "default" directory
      // here we assume that they were stored at "Files/Databases"
      let directory: string =  "Files/Databases"
      if(this.platform === "ios") directory = "Applications/Files/Databases"
      if(this.platform === "android" ) directory = "files/databases";  
      await this._sqlite.addSQLiteSuffix(directory);

      // check if database "testcopy" exists
      result = await this._sqlite.isDatabase("testcopy");
      if(!result.result) {
        return Promise.reject(new Error("Database 'testcopy' does not exist"));
      }
      // check if database "testfromfile" exists
      result = await this._sqlite.isDatabase("testfromfile");
      if(!result.result) {
        return Promise.reject(new Error("Database 'testfromfile' does not exist"));
      }

      // ************************************************
      // Query the database
      // ************************************************

      // create the connection to the database
      const db = await this._sqlite
                        .createConnection("testcopy", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection 'testcopy' failed"));

      // open db testcopy
      await db.open();
      // 
      // select all users in db
      result  = await db.query("SELECT * FROM users;");
      if(result .values.length !== 7 || result .values[0].name !== "Whiteley"
        || result .values[1].name !== "Jones"
        || result .values[2].name !== "Simpson"
        || result .values[3].name !== "Brown"
        || result .values[4].name !== "Jackson"
        || result .values[5].name !== "Kennedy"
        || result .values[6].name !== "Bush"
        ) {
          return Promise.reject(new Error("Query Users failed"));
      }

      // check if the table "users" exists
      result = await db.isTable("users");
      if(!result.result) {
        return Promise.reject(new Error("Table 'users' does not exist"));
      }

      // check if the table "messages" exists
      result = await db.isTable("messages");
      if(!result.result) {
        return Promise.reject(new Error("Table 'messages' does not exist"));
      }

      // check if the table "images" exists
      result = await db.isTable("images");
      if(!result.result) {
        return Promise.reject(new Error("Table 'images' does not exist"));
      }

      // check if the table "foo" exists
      result = await db.isTable("foo");
      if(result.result) {
        return Promise.reject(new Error("Table 'foo' exists"));
      }

      // delete old databases
      await this._sqlite.deleteOldDatabases();

      // create the connection to the database "testfromfile"
      const db1 = await this._sqlite
                        .createConnection("testfromfile", false,
                                          "no-encryption", 1);
      if(db1 === null) return Promise.reject(new Error("CreateConnection 'testfromfile' failed"));
      // open db testcopy
      await db1.open();
      // check if the table "users" exists
      result = await db1.isTable("users");
      if(!result.result) {
        return Promise.reject(new Error("Table 'users' does not exist"));
      }
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
          return Promise.reject(new Error("Query2 Users failed"));
      }
      // delete old databases
      await this._sqlite.deleteOldDatabases(directory);

      // initialize the connection for issue#82
      const db2 = await this._sqlite
                  .createConnection("test-issue82", false, "no-encryption", 1);
      // open db2 test-issue82
      await db2.open();

      // create tables in db2
      result = await db2.execute(createSchema82);
      if (result.changes.changes < 0) {
        return Promise.reject(new Error("Execute in db2 failed"));
      }
      // select all users in db
      result = await db2.query("SELECT * FROM drawings WHERE congregationId = '494f7713-4dfe-4a92-b1a9-75aadcd71022';");
      if(result.values.length !== 0) {     
        return Promise.reject(new Error("Query in db2 failed"));
      }

      // close the connection "testcopy"
      await this._sqlite.closeConnection("testcopy"); 
      this._detailService.setExportJson(false);
      // close the connection "testfromfile"
      await this._sqlite.closeConnection("testfromfile"); 

      // close the connection "test-issue82"
      await this._sqlite.closeConnection("test-issue82"); 
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
