import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';

import { createSchema, twoUsers, twoTests } from '../utils/no-encryption-utils';
import { createSchemaContacts, setContacts } from '../utils/encrypted-set-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-testissue111',
  templateUrl: 'testissue111.page.html',
  styleUrls: ['testissue111.page.scss']
})
export class TestIssue111Page implements AfterViewInit {
  detail: boolean = false;
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

      var retDict: Map<string, any> = await this._sqlite.retrieveAllConnections();
/*      if(retDict.size > 0) {
        for (var conn in retDict) {
          console.log(`connection: ${conn}`)
        }  
      }
*/
      // initialize the connection
      let db: SQLiteDBConnection;
      let isConn: any = await this._sqlite.isConnection("testIssue111.db");
      if(isConn.result) {
        db = await this._sqlite.retrieveConnection("testIssue111.db");
      } else 
        db = await this._sqlite
                  .createConnection("testIssue111.db", false, "no-encryption", 1);
      let db1: SQLiteDBConnection;
      if((await this._sqlite.isConnection("testSetIssue111.db")).result) {
        db1 = await this._sqlite.retrieveConnection("testSetIssue111.db");
      } else 
        db1 = await this._sqlite
                  .createConnection("testSetIssue111.db", true, "secret", 1);
      // check if the databases exist 
      // and delete it for multiple successive tests
      await deleteDatabase(db);
      await deleteDatabase(db1);

      // open db testNew
      await db.open();

      // create tables in db
      let ret: any = await db.execute(createSchema,false);
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }

      // create synchronization table 
      ret = await db.createSyncTable();
      
      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      // add two users in db
      ret = await db.execute(twoUsers, false);
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute 2 users failed"));
      }
      // select all users in db
      ret = await db.query("SELECT * FROM users;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query 2 users failed"));
      }

      // open db testSet
      await db1.open();

      // create tables in db1
      ret = await db1.execute(createSchemaContacts, false);

      // load setContacts in db1
      ret = await db1.executeSet(setContacts, false);
      if (ret.changes.changes !== 5) {
        return Promise.reject(new Error("ExecuteSet 5 contacts failed"));
      }

      // select users where company is NULL in db
      ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query 2 users where company is null failed"));
      }
      // add one user with statement and values              
      let sqlcmd: string = 
                  "INSERT INTO users (name,email,age) VALUES (?,?,?)";
      let values: Array<any>  = ["Simpson","Simpson@example.com",69];
      ret = await db.run(sqlcmd, values, false);
      if(ret.changes.lastId !== 3) {
        return Promise.reject(new Error("Run 1 users with statement & values failed"));
      }
      // add one user with statement              
      sqlcmd = `INSERT INTO users (name,email,age) VALUES ` + 
                                `("Brown","Brown@example.com",15)`;
      ret = await db.run(sqlcmd, [], false);
      if(ret.changes.lastId !== 4) {
        return Promise.reject(new Error("Run 1 users with statement failed"));
      }
      // add some tests issue#56
      ret = await db.execute(twoTests, false);
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute issue#56 failed"));
      }
      // add one test
      sqlcmd = "INSERT INTO test56 (name) VALUES (?)";
      let vals: Array<any>  = ["test 3 added insert "];
      ret = await db.run(sqlcmd, vals, false);
      if (ret.changes.changes !== 1 || ret.changes.lastId !== 3) {
        return Promise.reject(new Error("Run 1 test issue#56 failed"));
      }
      // add a null test
      vals  = [null];
      ret = await db.run(sqlcmd, vals, false);
      if (ret.changes.changes !== 1 || ret.changes.lastId !== 4) {
        return Promise.reject(new Error("Run 1 test null issue#56 failed"));
      }
      // add a another null test
      vals  = [];
      ret = await db.run(sqlcmd, vals, false);
      if (ret.changes.changes !== 1 || ret.changes.lastId !== 5) {
        return Promise.reject(new Error("Run another null test issue#56 failed"));
      }
      // add test [null, 'test2']
      sqlcmd = "INSERT INTO test56 (name,name1) VALUES (?,?)";
      vals = [null, 'test2']
      ret = await db.run(sqlcmd, vals, false);
      if (ret.changes.changes !== 1 || ret.changes.lastId !== 6) {
        return Promise.reject(new Error("Run [null, 'test2'] test issue#56 failed"));
      }
      ret= await this._sqlite.checkConnectionsConsistency();

      var retDict: Map<string, any> = await this._sqlite.retrieveAllConnections();
/*      for (var conn in retDict) {
        console.log(`connection: ${conn}`)
      }
*/
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
