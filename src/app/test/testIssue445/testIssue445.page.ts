import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';

import { schemaTable2_3Issue445, schemaTable1DefaultIssue445,
  schemaTable1RestrictIssue445, schemaTable1CascadeIssue445 } from '../utils/issue445-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BooleanValueAccessor } from '@ionic/angular';

@Component({
  selector: 'app-testIssue445',
  templateUrl: 'testIssue445.page.html',
  styleUrls: ['testIssue445.page.scss']
})
export class TestIssue445Page implements AfterViewInit {
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
      // run tests for ON DELETE SET DEFAULT
      await this.testSetDefault();
      // run tests for ON DELETE RESTRICT
      await this.testRestrict();
      // run tests for ON DELETE CASCADE
      await this.testCascade();
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
  async tableNullCount(db: SQLiteDBConnection, tableName: string, colNames: string[]): Promise<any> {
    let retCounts = {};
    let sql = `SELECT count(*) as count FROM ${tableName} WHERE `;
    for (const name of colNames) {
      sql += `${name} IS NULL AND `
    }
    sql += `sql_deleted = 0;`
    console.log("sql: ", sql)
    const retQuery = await db.query( sql);
    retCounts[`${tableName}`] = retQuery.values[0]["count"];
    console.log("retCounts: ", retCounts)
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
  async testTable1(db: SQLiteDBConnection): Promise<void> {
    try {
      let sqlDel1 = "DELETE FROM Table_1 WHERE product_id = ? AND product_type = ?;";
      let valDel1 = ['MyProduct3', 'object'];
      let ret = await db.run(sqlDel1, valDel1);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
      sqlDel1 = "DELETE FROM Table_1 WHERE product_type = 'book';";
      ret = await db.execute(sqlDel1);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
      sqlDel1 = "DELETE FROM Table_1 WHERE product_type = 'object' AND result_slug = 'slug_1';";
      ret = await db.run(sqlDel1);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
      sqlDel1 = "DELETE FROM Table_1 WHERE (result_id,result_slug) IN (VALUES ('511fea83-9f5f-4606-85ec-3d769da4bf63','slug_3'),('2a38839e-3b0d-47f0-9e60-d6b19c0978ad', 'slug_5'));";
      ret = await db.run(sqlDel1);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
      const query1Table1 = ('SELECT id,product_type,sql_deleted FROM table_1');
      const ret1Q1 = await db.query(query1Table1);
      console.log(`>>>> After testTable1 table_1: ${JSON.stringify(ret1Q1)}`);
    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(err);
    }
  }
  async testTable2(db: SQLiteDBConnection): Promise<void> {
    try {
      let sqlDel2 = "DELETE FROM Table_2 WHERE description = 'my_slug_1';";
      let ret = await db.run(sqlDel2);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
      sqlDel2 = "DELETE FROM Table_2 WHERE id = 'e8fa8d54-641a-4d7b-9422-91474d713c62' AND slug = 'slug_2';"
      ret = await db.execute(sqlDel2);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)

      sqlDel2 = "DELETE FROM Table_2 WHERE slug IN ('slug_3','slug_4');";
      ret = await db.run(sqlDel2);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
      sqlDel2 = "DELETE  FROM Table_2 WHERE slug BETWEEN 'slug_1' AND 'slug_5' AND sql_deleted=0;";
      ret = await db.run(sqlDel2);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(err);
    }
  }
  async testTable3(db: SQLiteDBConnection): Promise<void> {
    try {
      let sqlDel3 = "DELETE FROM Table_3 WHERE id IN (2,3);";
      let ret = await db.run(sqlDel3);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
      const deleteSet = [
        {
            statement: "DELETE FROM Table_3 WHERE id = ?;",
            values: [
                [1],
                [4]
            ]
        }
      ];
      ret = await db.executeSet(deleteSet);
      console.log(`>>> delete executeSet res: ${JSON.stringify(ret)}`)
    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(err);
    }
  }
  async testSetDefault(): Promise<void> {
    try {
      const db: SQLiteDBConnection = await this.openDatabase('testDefIssue#445');
      let retInit1 = await db.execute(schemaTable1DefaultIssue445);
      console.log("schema Table1 retInit1: ", retInit1)
      retInit1 = await db.execute(schemaTable2_3Issue445);
      console.log("schema Table2_3 retInit1: ", retInit1)
      // create synchronization table
      const retSync1 = await db.createSyncTable();

      // set the synchronization date
      const syncDate1: string = "2023-07-26T08:30:25.000Z";
      await db.setSyncDate(syncDate1);

      const query1Table3 = ('SELECT * FROM table_3');
      const ret1Q3 = await db.query(query1Table3);
      console.log(`>>>> Query1 table_3: ${JSON.stringify(ret1Q3)}`)

      const query1Table2 = ('SELECT * FROM table_2');
      const ret1Q2 = await db.query(query1Table2);
      console.log(`>>>> Query1 table_2: ${JSON.stringify(ret1Q2)}`)

      const query1Table1 = ('SELECT * FROM table_1');
      const ret1Q1 = await db.query(query1Table1);
      console.log(`>>>> Query1 table_1: `, ret1Q1);

      /****************************
       * Test DELETE from Table_1 *
       ****************************/
      await this.delay(2,'before deleteTest Table_1')
      let initCounts = await this.tablesCount(db);
      await this.testTable1(db);
      let finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      if(finalCounts["Table_3"] !== initCounts["Table_3"] ||
         finalCounts["Table_2"] !== initCounts["Table_2"] ||
         finalCounts["Table_1"] !== 1) {
          const msg = `\n *******************************************` +
                      `\n * Test DELETE DEFAULT from Table_1 failed *` +
                      `\n ******************************************* \n`;
          return Promise.reject(`${msg}`);
      }
      await this.delay(2,'before reset sql_deleted to zero Table_1')
      // reset Table_1 to sql_deleted = 0
      let sqlDel1 = "UPDATE Table_1 SET sql_deleted = 0 WHERE sql_deleted = 1;";
      let ret = await db.run(sqlDel1);
      console.log(`ret.changes.changes: ${ret.changes.changes}`)
      console.log(`\n`);
      console.log('***********************************************');
      console.log('* Test DELETE DEFAULT from Table_1 successful *');
      console.log('***********************************************');
      /****************************
       * Test DELETE from Table_2 *
       ****************************/
      await this.delay(2,'before deleteTest Table_2')
      // get tables count
      initCounts = await this.tablesCount(db);
      await this.testTable2(db);
      finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      if(finalCounts["Table_3"] !== initCounts["Table_3"] ||
          finalCounts["Table_2"] !== 0 ||
          finalCounts["Table_1"] !== initCounts["Table_1"]) {
          const msg = `\n *******************************************` +
                      `\n * Test DELETE DEFAULT from Table_2 failed *` +
                      `\n ******************************************* \n`;
          return Promise.reject(`${msg}`);
      }

      console.log(`\n`);
      console.log('***********************************************');
      console.log('* Test DELETE DEFAULT from Table_2 successful *');
      console.log('***********************************************');

      /****************************
       * Test DELETE from Table_3 *
       ****************************/
      await this.delay(2,'before deleteTest Table_3')
      // get tables count
      initCounts = await this.tablesCount(db);
      await this.testTable3(db);
      finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      const table1NullCounts = await this.tableNullCount(db,'Table_1',['result_id','result_slug','person_id']);
      if(finalCounts["Table_3"] !== 1 ||
          finalCounts["Table_2"] !== 0 ||
          finalCounts["Table_1"] !== initCounts["Table_1"] ||
          table1NullCounts["Table_1"] !== initCounts["Table_1"]) {
          const msg = `\n *******************************************` +
                      `\n * Test DELETE DEFAULT from Table_3 failed *` +
                      `\n ******************************************* \n`;
          return Promise.reject(`${msg}`);
      }
      await this._sqlite.closeConnection("testDefIssue#445");
      console.log(`\n`);
      console.log('***********************************************');
      console.log('* Test DELETE DEFAULT from Table_3 successful *');
      console.log('***********************************************');

      return;
    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(err);
    }
  }
  async testRestrict(): Promise<void> {
    try {
      const db: SQLiteDBConnection = await this.openDatabase('testResIssue#445');
      let retInit1 = await db.execute(schemaTable1RestrictIssue445);
      console.log("schema Table1 retInit1: ", retInit1)
      retInit1 = await db.execute(schemaTable2_3Issue445);
      console.log("schema Table2_3 retInit1: ", retInit1)
      // create synchronization table
      const retSync1 = await db.createSyncTable();

      // set the synchronization date
      const syncDate1: string = "2023-07-26T08:30:25.000Z";
      await db.setSyncDate(syncDate1);

      const query1Table3 = ('SELECT * FROM table_3');
      const ret1Q3 = await db.query(query1Table3);
      console.log(`>>>> Query1 table_3: ${JSON.stringify(ret1Q3)}`)

      const query1Table2 = ('SELECT * FROM table_2');
      const ret1Q2 = await db.query(query1Table2);
      console.log(`>>>> Query1 table_2: ${JSON.stringify(ret1Q2)}`)

      const query1Table1 = ('SELECT * FROM table_1');
      const ret1Q1 = await db.query(query1Table1);
      console.log(`>>>> Query1 table_1: ${JSON.stringify(ret1Q1)}`);
      /****************************
       * Test DELETE from Table_1 *
       ****************************/
      await this.delay(2,'before deleteTest Table_1')
      let initCounts = await this.tablesCount(db);
      await this.testTable1(db);
      let finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      if(finalCounts["Table_3"] !== initCounts["Table_3"] ||
         finalCounts["Table_2"] !== initCounts["Table_2"] ||
         finalCounts["Table_1"] !== 1) {
          const msg = `\n *******************************************` +
                      `\n * Test DELETE RESTRICT from Table_1 failed *` +
                      `\n ******************************************* \n`;
          return Promise.reject(`${msg}`);
      }
      // reset Table_1 to sql_deleted = 0
      await this.delay(2,'before reset sql_deleted to zero Table_1')
      let sqlDel1 = "UPDATE Table_1 SET sql_deleted = 0 WHERE sql_deleted = 1;";
      let ret = await db.run(sqlDel1);
      finalCounts = await this.tablesCount(db);
      console.log(`finalCounts after update: ${JSON.stringify(finalCounts)}`)
      console.log(`\n`);
      console.log('************************************************');
      console.log('* Test DELETE RESTRICT from Table_1 successful *');
      console.log('************************************************');
      /****************************
       * Test DELETE from Table_2 *
       ****************************/
      await this.delay(2,'before deleteTest Table_2')
      // get tables count
      initCounts = await this.tablesCount(db);
      try {
        let sqlDel2 = "DELETE FROM Table_2 WHERE description = 'my_slug_1';";
        ret = await db.run(sqlDel2);
      } catch(error) {
        let msg = error.message ? error.message : error;
        console.log(`>>> message: ${msg}`);
        console.log('>>> cannot delete description = "my_slug_1" in RESTRICT mode');
        // Delete first related elements in Table_1
        console.log('Delete first related elements in Table_1')
        let sqlDel2 = "DELETE FROM Table_1 WHERE (result_id,result_slug) IN " +
            "( VALUES ('834efdb6-6044-4b44-8fcb-560710936f37', 'slug_1')," +
            "('74dca5e8-c702-4e70-ad16-0a16a64d55fa', 'slug_1'));"
        ret = await db.run(sqlDel2);
        console.log(`>>>> Delete ret.changes.changes table_1: `, ret.changes.changes);
        console.log('Delete elements from Table_2')
        sqlDel2 = "DELETE FROM Table_2 WHERE description = 'my_slug_1';";
        ret = await db.run(sqlDel2);
        console.log(`>>>> Delete ret.changes.changes table_2: `, ret.changes.changes);

      }
      finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      if(finalCounts["Table_3"] !== initCounts["Table_3"] ||
        finalCounts["Table_2"] !== 8 ||
        finalCounts["Table_1"] !== 8) {
          const msg = `\n ********************************************` +
                      `\n * Test DELETE RESTRICT from Table_2 failed *` +
                      `\n ******************************************** \n`;
          return Promise.reject(`${msg}`);
      }

      console.log(`\n`);
      console.log('************************************************');
      console.log('* Test DELETE RESTRICT from Table_2 successful *');
      console.log('************************************************');

      /****************************
       * Test DELETE from Table_3 *
       ****************************/
      await this.delay(2,'before deleteTest Table_3')
      // get tables count
      initCounts = await this.tablesCount(db);
      try {
        let sqlDel3 = "DELETE FROM Table_3 WHERE id IN (2,3);";
        ret = await db.run(sqlDel3);
      } catch(error) {
        let msg = error.message ? error.message : error;
        console.log(`>>> message: ${msg}`);
        console.log('>>> cannot delete id IN (2,3) in RESTRICT mode');
        // Delete first related elements in Table_1
        let sqlDel3 = "DELETE FROM Table_1 WHERE person_id BETWEEN 2 AND 3;";
        ret = await db.run(sqlDel3);
        console.log(`>>>> Delete ret.changes.changes table_1: `, ret.changes.changes);
        // Delete element from Table_3
        sqlDel3 = "DELETE FROM Table_3 WHERE id IN (2,3);";
        ret = await db.run(sqlDel3);
        finalCounts = await this.tablesCount(db);
        console.log(`Counts init: ${JSON.stringify(initCounts)}`);
        console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
        if(finalCounts["Table_3"] !== 3 ||
          finalCounts["Table_2"] !== initCounts["Table_2"] ||
          finalCounts["Table_1"] !== 4) {
            const msg = `\n ********************************************` +
                        `\n * Test DELETE RESTRICT from Table_3 failed *` +
                        `\n ******************************************** \n`;
            return Promise.reject(`${msg}`);
        }
        await this._sqlite.closeConnection("testResIssue#445");
        console.log(`\n`);
        console.log('************************************************');
        console.log('* Test DELETE RESTRICT from Table_3 successful *');
        console.log('************************************************');
      }
    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(err);
    }
  }
  async testCascade(): Promise<void> {
    try {
      const db: SQLiteDBConnection = await this.openDatabase('testCasIssue#445');
      let retInit1 = await db.execute(schemaTable1CascadeIssue445);
      console.log("schema Table1 retInit1: ", retInit1)
      retInit1 = await db.execute(schemaTable2_3Issue445);
      console.log("schema Table2_3 retInit1: ", retInit1)
      // create synchronization table
      const retSync1 = await db.createSyncTable();

      // set the synchronization date
      const syncDate1: string = "2023-07-26T08:30:25.000Z";
      await db.setSyncDate(syncDate1);

      const query1Table3 = ('SELECT * FROM table_3');
      const ret1Q3 = await db.query(query1Table3);
      console.log(`>>>> Query1 table_3: ${JSON.stringify(ret1Q3)}`)

      const query1Table2 = ('SELECT * FROM table_2');
      const ret1Q2 = await db.query(query1Table2);
      console.log(`>>>> Query1 table_2: ${JSON.stringify(ret1Q2)}`)

      const query1Table1 = ('SELECT * FROM table_1');
      const ret1Q1 = await db.query(query1Table1);
      console.log(`>>>> Query1 table_1: `, ret1Q1);
      /****************************
       * Test DELETE from Table_1 *
       ****************************/
      await this.delay(2,'before deleteTest Table_1')
      let initCounts = await this.tablesCount(db);
      await this.testTable1(db);
      let finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      if(finalCounts["Table_3"] !== initCounts["Table_3"] ||
         finalCounts["Table_2"] !== initCounts["Table_2"] ||
         finalCounts["Table_1"] !== 1) {
          const msg = `\n *******************************************` +
                      `\n * Test DELETE CASCADE from Table_1 failed *` +
                      `\n ******************************************* \n`;
          return Promise.reject(`${msg}`);
      }
      // reset Table_1 to sql_deleted = 0
      await this.delay(2,'before reset sql_deleted to zero Table_1')
      let sqlDel1 = "UPDATE Table_1 SET sql_deleted = 0 WHERE sql_deleted = 1;";
      let ret = await db.run(sqlDel1);
      console.log(`\n`);
      console.log('***********************************************');
      console.log('* Test DELETE CASCADE from Table_1 successful *');
      console.log('***********************************************');
      /****************************
       * Test DELETE from Table_2 *
       ****************************/
      await this.delay(2,'before deleteTest Table_2')
      // get tables count
      initCounts = await this.tablesCount(db);
      await this.testTable2(db);
      finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      if(finalCounts["Table_3"] !== initCounts["Table_3"] ||
          finalCounts["Table_2"] !== 0 ||
          finalCounts["Table_1"] !== 2) {
          const msg = `\n *******************************************` +
                      `\n * Test DELETE CASCADE from Table_2 failed *` +
                      `\n ******************************************* \n`;
          return Promise.reject(`${msg}`);
      }

      console.log(`\n`);
      console.log('***********************************************');
      console.log('* Test DELETE CASCADE from Table_2 successful *');
      console.log('***********************************************');
      /****************************
       * Test DELETE from Table_3 *
       ****************************/
      await this.delay(2,'before deleteTest Table_3')
      // reset Table_1 to sql_deleted = 0
      await this.delay(2,'before reset sql_deleted to zero Table_1')
      sqlDel1 = "UPDATE Table_1 SET sql_deleted = 0 WHERE sql_deleted = 1;";
      ret = await db.run(sqlDel1);

      // get tables count
      initCounts = await this.tablesCount(db);
      await this.testTable3(db);
      finalCounts = await this.tablesCount(db);
      console.log(`Counts init: ${JSON.stringify(initCounts)}`);
      console.log(`Counts final: ${JSON.stringify(finalCounts)}`);
      if(finalCounts["Table_3"] !== 1 ||
          finalCounts["Table_2"] !== 0 ||
          finalCounts["Table_1"] !== 2) {
          const msg = `\n *******************************************` +
                      `\n * Test DELETE DEFAULT from Table_3 failed *` +
                      `\n ******************************************* \n`;
          return Promise.reject(`${msg}`);
      }
      await this._sqlite.closeConnection("testCasIssue#445");
      console.log(`\n`);
      console.log('***********************************************');
      console.log('* Test DELETE DEFAULT from Table_3 successful *');
      console.log('***********************************************');
      return;
    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(err);
    }
  }

}
