import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';

import { schemaExtrasIssue470, schemaFaresIssue470, dataIssue470} from '../utils/issue470-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-testIssue470',
  templateUrl: 'testIssue470.page.html',
  styleUrls: ['testIssue470.page.scss']
})
export class TestIssue470Page implements AfterViewInit {
  detail: boolean = false;
  isNative: boolean;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {
                this.isNative = this._sqlite.native;
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
      let msg = err.message ? err.message : err;
      console.log(`$$$ runTest failed ${err}`);
      await showAlert(err);
    }
  }


  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World from Jeep");
      console.log(`from echo: ${result.value}`);
      // run tests
      await this.testIssue470();
      return Promise.resolve();
    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(msg);
    }
  }
  async delay(delay: number, message: string): Promise<void> {
    return new Promise (resolve => {
      setTimeout(() => {
        const s = "*".repeat(message.length)
        console.log(`*****************${s}`);
        console.log(`Simulate a delay ${message}`);
        console.log(`*****************${s}`);
        resolve();
      }, delay * 1000);
    });
  }
  async tablesCount(db: SQLiteDBConnection): Promise<any> {
    let retCounts = {};
    let ret = await db.getTableList();
    for (const tableName of ret.values) {
      const retQuery = await db.query(`SELECT count(*) as count FROM ${tableName} WHERE sql_deleted = 0;`);
      retCounts[`${tableName}`] = retQuery.values[0]["count"];
    }
    return retCounts;
  }

  async openDatabase(dbName: string,):Promise <SQLiteDBConnection> {
    let db: SQLiteDBConnection;
    const retCC = (await this._sqlite.checkConnectionsConsistency()).result;
    let isConn = (await this._sqlite.isConnection(dbName)).result;
    if(retCC && isConn) {
      db = await this._sqlite.retrieveConnection(dbName);
    } else {
      db = await this._sqlite
                .createConnection(dbName, false, "no-encryption", 1);
    }
    // open db dbName
    await db.open();
    return db;
  }
  async deleteExtrasByFareId(db: SQLiteDBConnection, fareId: string): Promise<any> {
    const sqlQuery = `DELETE FROM Extras WHERE FareId=?`;

    const sqlValues = [fareId];

    return await db.run(sqlQuery, sqlValues, false);
  }
  async testIssue470(): Promise<void> {
    try {
      const db: SQLiteDBConnection = await this.openDatabase('testIssue#470');
      // Create table Extras
      let retInit1 = await db.execute(schemaExtrasIssue470);
      console.log("schema Extras retInit1: ", retInit1)
      // Create table Fares
      retInit1 = await db.execute(schemaFaresIssue470);
      console.log("schema Fares retInit1: ", retInit1)
      // Initialize some data
      retInit1 = await db.execute(dataIssue470);

      // create synchronization table
      const retSync1 = await db.createSyncTable();

      // set the synchronization date
      const syncDate1: string = "2023-09-28T08:30:25.000Z";
      await db.setSyncDate(syncDate1);

      const query1Extras = ('SELECT * FROM Extras');
      const ret1Ex = await db.query(query1Extras);
      console.log(`>>>> Query1 table_3: ${JSON.stringify(ret1Ex)}`)

      const query1Fares = ('SELECT * FROM Fares');
      const ret1Fa = await db.query(query1Fares);
      console.log(`>>>> Query1 Fares: ${JSON.stringify(ret1Fa)}`)


      /****************************
       * Test DELETE from Extras  *
       ****************************/
      await this.delay(2,'before deleteTest Extras')
      let initCounts = await this.tablesCount(db);

      await this.deleteExtrasByFareId(db, 'e8fa8d54-641a-4d7b-9422-91474d713c62');
      let finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      await this._sqlite.closeConnection("testIssue#470");
      console.log(`\n`);
      console.log('**************************************');
      console.log('* Test DELETE from Extras successful *');
      console.log('**************************************');

      return;
    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(err);
    }
  }

}
