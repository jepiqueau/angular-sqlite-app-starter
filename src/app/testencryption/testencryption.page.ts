import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { createSchema, twoUsers} from '../utils/no-encryption-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testencryption',
  templateUrl: 'testencryption.page.html',
  styleUrls: ['testencryption.page.scss']
})
export class TestencryptionPage implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
    console.log("%%%% in TestencryptionPage this._sqlite " + this._sqlite)
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
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
      // Create Database No Encryption
      // ************************************************

      // initialize the connection
      let db = await this._sqlite
                  .createConnection("testEncryption", false, "no-encryption", 1);

      // open db testEncryption
      await db.open();

      // create tables in db
      let ret: any = await db.execute(createSchema);
      console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }

      // create synchronization table 
      ret = await db.createSyncTable();
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSyncTable failed"));
      }
      
      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      // add two users in db
      ret = await db.execute(twoUsers);
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute twoUsers failed"));
      }
      // select all users in db
      ret = await db.query("SELECT * FROM users;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query1 twoUsers failed"));
      }

      // select users where company is NULL in db
      ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query2 Users where Company null failed"));
      }
      // add one user with statement and values              
      let sqlcmd: string = 
                  "INSERT INTO users (name,email,age) VALUES (?,?,?)";
      let values: Array<any>  = ["Simpson","Simpson@example.com",69];
      ret = await db.run(sqlcmd,values);
      console.log()
      if(ret.changes.lastId !== 3) {
        return Promise.reject(new Error("Run1 add 1 User failed"));
      }
      // add one user with statement              
      sqlcmd = `INSERT INTO users (name,email,age) VALUES ` + 
                                `("Brown","Brown@example.com",15)`;
      ret = await db.run(sqlcmd);
      if(ret.changes.lastId !== 4) {
        return Promise.reject(new Error("Run2 add 1 User failed"));
      }

      await this._sqlite.closeConnection("testEncryption"); 

      // ************************************************
      // Encrypt the existing database
      // ************************************************

      // initialize the connection
      db = await this._sqlite
                  .createConnection("testEncryption", true, "encryption", 1);

      // open db testEncryption
      await db.open();
      // close the connection
      await this._sqlite.closeConnection("testEncryption"); 
      console.log("closeConnection encrypted ")
      // ************************************************
      // Work with the encrypted  database
      // ************************************************

      // initialize the connection
      db = await this._sqlite
                  .createConnection("testEncryption", true, "secret", 1);

      // open db testEncryption
      await db.open();

      // add one user with statement and values              
      sqlcmd = 
                  "INSERT INTO users (name,email,age) VALUES (?,?,?)";
      values = ["Jackson","Jackson@example.com",32];
      ret = await db.run(sqlcmd,values);
      if(ret.changes.lastId !== 5) {
        return Promise.reject(new Error("Run3 add 1 User failed"));
      }

      // select all users in db
      ret = await db.query("SELECT * FROM users;");
      console.log("query encrypted " + ret.values.length )
      if(ret.values.length !== 5 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones" ||
                                    ret.values[2].name !== "Simpson" ||
                                    ret.values[3].name !== "Brown" ||
                                    ret.values[4].name !== "Jackson") {
        return Promise.reject(new Error("Query3  5 Users failed"));
      }

      // delete it for multiple successive tests
      await deleteDatabase(db);
      
      await this._sqlite.closeConnection("testEncryption"); 

      return Promise.resolve();

    } catch (err) {
      return Promise.reject(err);
    }

  }

}
