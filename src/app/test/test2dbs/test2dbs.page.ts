import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';

import { createSchema, twoUsers, twoTests } from '../utils/no-encryption-utils';
import { createSchemaContacts, setContacts, setIssue170,
  createSchemaIssues220221, setIssues220221, updIssues220221 } from '../utils/encrypted-set-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-test2dbs',
  templateUrl: 'test2dbs.page.html',
  styleUrls: ['test2dbs.page.scss']
})
export class Test2dbsPage implements AfterViewInit {
  detail: boolean = false;
  isNative: boolean;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {
                this.isNative = this._sqlite.native
              }

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
      let result: any = await this._sqlite.echo("Hello World from Jeep");
      console.log(`from echo: ${result.value}`);
      // initialize the connection
      let db: SQLiteDBConnection;
      let db1: SQLiteDBConnection;
      const retCC = (await this._sqlite.checkConnectionsConsistency()).result;
      let isConn = (await this._sqlite.isConnection("testNew")).result;
      if(retCC && isConn) {
        db = await this._sqlite.retrieveConnection("testNew");
      } else {
        db = await this._sqlite
                  .createConnection("testNew", false, "no-encryption", 1);
      }
      isConn = (await this._sqlite.isConnection("testSet")).result
      if(retCC && isConn) {
        db1 = await this._sqlite.retrieveConnection("testSet");
      } else {                          
        db1 = await this._sqlite
                  .createConnection("testSet", true, "secret", 1);
      }

      // check if the databases exist 
      // and delete it for multiple successive tests
      await deleteDatabase(db);
      await deleteDatabase(db1);

      // open db testNew
      await db.open();

      // create tables in db
      let ret: any = await db.execute(createSchema);
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }

      // create synchronization table 
      ret = await db.createSyncTable();
      
      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      // delete users if any from previous run
      let delUsers = `DELETE FROM users;`;
      ret = await db.execute(delUsers, false);

      // add two users in db
      ret = await db.execute(twoUsers);
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
      ret = await db1.execute(createSchemaContacts);

      // load setContacts in db1
      ret = await db1.executeSet(setContacts);
      if (ret.changes.changes !== 5) {
        return Promise.reject(new Error("ExecuteSet 5 contacts failed"));
      }

      // test issue170
      ret = await db1.executeSet(setIssue170);
      if (ret.changes.changes !== 1) {
        return Promise.reject(new Error("ExecuteSet 6 issue170 failed"));
      }

      // select users where company is NULL in db
      ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query 2 users where company is null failed"));
      }
      // add one user with statement and values              
      let sqlcmd: string = 
                  "INSERT INTO users (name,email,age,size,company) VALUES (?,?,?,?,?)";
      let values: Array<any>  = ["Simpson","Simpson@example.com",69,1.82,null];
      ret = await db.run(sqlcmd,values);
      if(ret.changes.lastId !== 3) {
        return Promise.reject(new Error("Run 1 users with statement & values failed"));
      }
      // add one user with statement              
      sqlcmd = `INSERT INTO users (name,email,age,size,company) VALUES ` + 
                                `("Brown","Brown@example.com",15,1.75,null)`;
      ret = await db.run(sqlcmd);
      if(ret.changes.lastId !== 4) {
        return Promise.reject(new Error("Run 1 users with statement failed"));
      }
      let delTest56 = `DELETE FROM test56;`;
      ret = await db.execute(delTest56, false);
      // add some tests issue#56
      ret = await db.execute(twoTests);
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute issue#56 failed"));
      }
      // add one test
      sqlcmd = "INSERT INTO test56 (name) VALUES (?)";
      let vals: Array<any>  = ["test 3 added insert "];
      ret = await db.run(sqlcmd,vals);
      if (ret.changes.changes !== 1 || ret.changes.lastId !== 3) {
        return Promise.reject(new Error("Run 1 test issue#56 failed"));
      }
      // add a null test
      vals  = [null];
      ret = await db.run(sqlcmd,vals);
      if (ret.changes.changes !== 1 || ret.changes.lastId !== 4) {
        return Promise.reject(new Error("Run 1 test null issue#56 failed"));
      }
      // add a another null test
      vals  = [];
      ret = await db.run(sqlcmd,vals);
      if (ret.changes.changes !== 1 || ret.changes.lastId !== 5) {
        return Promise.reject(new Error("Run another null test issue#56 failed"));
      }
      // add test [null, 'test2']
      sqlcmd = "INSERT INTO test56 (name,name1) VALUES (?,?)";
      vals = [null, 'test2']
      ret = await db.run(sqlcmd,vals);
      if (ret.changes.changes !== 1 || ret.changes.lastId !== 6) {
        return Promise.reject(new Error("Run [null, 'test2'] test issue#56 failed"));
      }
      // Test issues 220 && 221
      // create tables in db1
      ret = await db1.execute(createSchemaIssues220221);

      // load setIssues220221 in db1
      ret = await db1.executeSet(setIssues220221);
      console.log(`setIssues220221 ret ${JSON.stringify(ret)}`)
      if (ret.changes.changes !== 3) {
        return Promise.reject(new Error("ExecuteSet 3 issues220221 failed"));
      }

      // update updIssues220221 in db1
      ret = await db1.executeSet(updIssues220221);
      console.log(`updIssues220221 ret ${JSON.stringify(ret)}`)
      // update twice updIssues220221 in db1
      ret = await db1.executeSet(updIssues220221);
      console.log(`twice updIssues220221 ret ${JSON.stringify(ret)}`)
      
      // get the database version
      ret = await db.getVersion();
      if (ret.version !== 1) {
        return Promise.reject(new Error("GetVersion: version failed"));
      }
      this._detailService.setExistingConnection(true);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
