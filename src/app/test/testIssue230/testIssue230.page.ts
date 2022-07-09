import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';

import { createSchemaIssue230 } from '../utils/no-encryption-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-testIssue230',
  templateUrl: 'testIssue230.page.html',
  styleUrls: ['testIssue230.page.scss']
})
export class TestIssue230Page implements AfterViewInit {
  detail: boolean = false;
  isNative: boolean;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {
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
      if((await this._sqlite.isConnection("testIssue230")).result) {
        db = await this._sqlite.retrieveConnection("testIssue230");
      } else {
        db = await this._sqlite
                  .createConnection("testIssue230", false, "no-encryption", 1);
      }

      // check if the databases exist 
      // and delete it for multiple successive tests
      await deleteDatabase(db);

      // open db testIssue230
      await db.open();
      const name: string = db.getConnectionDBName();
      console.log(`>>>>>> dbName: ${name}`)

      const transaction: any = [
        {statement : createSchemaIssue230},
        {statement: "INSERT INTO DemoTable VALUES (?,?)",
          values: ["Alice",101]},
        {statement: "INSERT INTO DemoTable VALUES (?,?)",
          values: ["Betty",202]}
      ]
      console.log(`>>>>>> transaction: ${JSON.stringify(transaction)}`)
      await db.executeTransaction(transaction);
/*
        let ret: any = await db.execute("BEGIN TRANSACTION;",false);
        // create table in db
        ret = await db.execute(createSchemaIssue230,false);
        if (ret.changes.changes < 0) {
          await db.execute("ROLLBACK;",false);
          return Promise.reject(new Error("Execute createSchema failed"));
        }
        // do some INSERT
        let sqlcmd: string = 
        "INSERT INTO DemoTable VALUES (?,?)";
        let values: Array<any>  = ["Alice",101];
        ret = await db.run(sqlcmd,values,false);
        console.log(`INSERT1 ret.changes: ${JSON.stringify(ret.changes)}`);
        if(ret.changes.lastId === -1) {
          await db.execute("ROLLBACK;",false);
          return Promise.reject(new Error("Run 1 users with statement & values failed"));
        }
        values  = ["Betty",202];
        ret = await db.run(sqlcmd,values,false);
        console.log(`INSERT2 ret.changes: ${JSON.stringify(ret.changes)}`);
        if(ret.changes.lastId === -1) {
          await db.execute("ROLLBACK;",false);
          return Promise.reject(new Error("Run 1 users with statement & values failed"));
        }
        await db.execute("COMMIT;",false);
*/
        await this._sqlite.closeConnection("testIssue230"); 
        return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
