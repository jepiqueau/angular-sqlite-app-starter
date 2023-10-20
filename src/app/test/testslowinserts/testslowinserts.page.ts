import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';

import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-testslowinserts',
  templateUrl: 'testslowinserts.page.html',
  styleUrls: ['testslowinserts.page.scss']
})
export class TestSlowInsertsPage implements AfterViewInit {
  public messageList: string[] = [];
  detail: boolean = false;
  isNative: boolean;
  handlerPermissions: any;
  initPlugin: boolean = false;
  db: SQLiteDBConnection;
  count_start: number = 0;
  count_end: number = 0;

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
  async testInsert(i: number) {
    const msg = `test message ${i}`;
    const sql = `INSERT INTO test_table (remote_id, message) VALUES (${i}, '${msg}')`;
    await this.db.run(sql, [], false);
  };
  randomInt() {
    return Math.floor(Math.random() * (81 - 20) + 20);
  }
  randomDouble() {
    return (Math.random() * (2.11 - 1.50) + 1.50).toFixed(2);
  }
  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World from Jeep");
      console.log(`from echo: ${result.value}`);
      // initialize the connection
      const retCC = (await this._sqlite.checkConnectionsConsistency()).result;
      let isConn = (await this._sqlite.isConnection("testSlowInserts")).result;
      if(retCC && isConn) {
        this.db = await this._sqlite.retrieveConnection("testSlowInserts");
      } else {
        this.db = await this._sqlite
                  .createConnection("testSlowInserts", false, "no-encryption", 1);
      }
      console.log(`before deleteDatabase`);
      // check if the databases exist
      // and delete it for multiple successive tests
      await deleteDatabase(this.db);

      // open db testNew
      await this.db.open();
      const createSchema: string = `
        CREATE TABLE IF NOT EXISTS test_table (
            remote_id INTEGER PRIMARY KEY NOT NULL,
            message TEXT NOT NULL,
            size DOUBLE,
            number INT
        );
      `;
      // create tables in db
      let ret: any = await this.db.execute(createSchema);
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }
      console.log(`after schema creation`)

      // delete users if any from previous run
      let delTest = `DELETE FROM test_table;`;
      ret = await this.db.execute(delTest);
      console.log(`after execute DELETE FROM test_table`)
      const nInserts = 10000;
      let msg = "";
/*
      // test with transaction (web 17.27s)
      this.count_start = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      var start = Date.now()
      console.log(`start : ${start}`)
      for (var i=0;i<nInserts ;i++) {
        const msg = `test message ${i}`;
        const sql = `INSERT INTO test_table (remote_id, message) VALUES (${i}, '${msg}')`;
        await this.db.run(sql, [], true);
      }
      var end = Date.now();
      this.count_end = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      console.log(`$$$ count_start: ${this.count_start}`)
      console.log(`$$$ count_end: ${this.count_end}`)
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      msg = `with transaction time: ${diff}s for ${this.count_end} values`;
      this.messageList.push(msg);
      console.log(`$$$ ${msg}`);

      // test without transaction (web 17.27s)
      delTest = `DELETE FROM test_table;`;
      ret = await this.db.execute(delTest);
      console.log(`after execute DELETE FROM test_table`)
      this.count_start = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      var start = Date.now()
      console.log(`start : ${start}`)
      for (var i=0;i<nInserts;i++) {
        const msg = `test message ${i}`;
        const sql = `INSERT INTO test_table (remote_id, message) VALUES (${i}, '${msg}')`;
        await this.db.run(sql, [], false);
      }
      var end = Date.now();
      this.count_end = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      console.log(`$$$ count_start: ${this.count_start}`)
      console.log(`$$$ count_end: ${this.count_end}`)
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      msg = `without transaction time: ${diff}s for ${this.count_end} values`;
      this.messageList.push(msg);
      console.log(`$$$ ${msg}`);
*/
      // test run with one insert
      delTest = `DELETE FROM test_table;`;
      ret = await this.db.execute(delTest);
      console.log(`after execute DELETE FROM test_table`)
      this.count_start = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      var start = Date.now()
      console.log(`start : ${start}`)
      let sql1 = `INSERT INTO test_table (remote_id, message, size, number) VALUES `;
      let values = "";

      for (var i=0;i<nInserts;i++) {
        const msg = `test message ${i}`;
        if (i === nInserts -1) {
          values += `(${i}, '${msg}', ${this.randomDouble()}, ${this.randomInt()});`;
        } else {
          values += `(${i}, '${msg}', ${this.randomDouble()}, ${this.randomInt()}),`;
        }
      }
      sql1 += values;
      await this.db.run(sql1, [], true);
      var end = Date.now();
      this.count_end = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      console.log(`$$$ count_start: ${this.count_start}`)
      console.log(`$$$ count_end: ${this.count_end}`)
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      msg = `run with 1 insert  time: ${diff}s for ${this.count_end} values`;
      this.messageList.push(msg);

      // test with executeSet
      delTest = `DELETE FROM test_table;`;
      ret = await this.db.execute(delTest);
      console.log(`after execute DELETE FROM test_table`)
      this.count_start = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      var start = Date.now()
      console.log(`start : ${start}`)
      const sqlSet = [];
      const sqlStmt = `INSERT INTO test_table (remote_id, message, size, number) VALUES (?,?,?,?)`;
      const sqlValues = [];
      for (var i=0;i<nInserts;i++) {
        const msg = `test message ${i}`;
        const mValues= [];
        mValues.push(i);
        mValues.push(msg);
        mValues.push(this.randomDouble());
        mValues.push(this.randomInt());
        sqlValues.push(mValues);
      }
      sqlSet.push({statement: sqlStmt, values: sqlValues});
      const retSet = await this.db.executeSet(sqlSet);
      console.log(`&&& retSet: ${JSON.stringify(retSet)}`);
      var end = Date.now();
      this.count_end = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      console.log(`$$$ count_start: ${this.count_start}`)
      console.log(`$$$ count_end: ${this.count_end}`)
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      msg = `with executeSet time: ${diff}s for ${this.count_end} values`;
      this.messageList.push(msg);

      // test execute with n inserts
      delTest = `DELETE FROM test_table;`;
      ret = await this.db.execute(delTest);
      console.log(`after execute DELETE FROM test_table`)
      this.count_start = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      var start = Date.now()
      console.log(`start : ${start}`)
      let execStmt = "";
      sql1 = `INSERT INTO test_table (remote_id, message, size, number) VALUES `;

      for (var i=0;i<nInserts;i++) {
        const msg = `test message ${i}`;
        const strValues = `(${i}, '${msg}', ${this.randomDouble()}, ${this.randomInt()} );\n`;
        execStmt += sql1 + strValues;
      }
      await this.db.execute(execStmt, true);
      var end = Date.now();
      this.count_end = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      console.log(`$$$ count_start: ${this.count_start}`)
      console.log(`$$$ count_end: ${this.count_end}`)
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      msg = `execute with ${nInserts} inserts  time: ${diff}s for ${this.count_end} values`;
      this.messageList.push(msg);

      // test execute with one insert
      delTest = `DELETE FROM test_table;`;
      ret = await this.db.execute(delTest);
      console.log(`after execute DELETE FROM test_table`)
      this.count_start = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      var start = Date.now()
      console.log(`start : ${start}`)
      sql1 = `INSERT INTO test_table (remote_id, message, size, number) VALUES `;
      let strValues = "";

      for (var i=0;i<nInserts;i++) {
        const msg = `test message ${i}`;
        if (i === nInserts -1) {
          strValues += `(${i}, '${msg}', ${this.randomDouble()}, ${this.randomInt()});`;
        } else {
          strValues += `(${i}, '${msg}', ${this.randomDouble()}, ${this.randomInt()}),`;
        }
      }
      sql1 += strValues;
      await this.db.execute(sql1, true);
      var end = Date.now();
      this.count_end = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      console.log(`$$$ count_start: ${this.count_start}`)
      console.log(`$$$ count_end: ${this.count_end}`)
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      msg = `execute with 1 insert  time: ${diff}s for ${this.count_end} values`;
      this.messageList.push(msg);
/*
      // test issue#479
      delTest = `DELETE FROM test_table;`;
      ret = await this.db.execute(delTest);
      console.log(`after execute DELETE FROM test_table`)
      this.count_start = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      var start = Date.now()
      const setSql = [
        { statement: "INSERT INTO test_table (remote_id, message) VALUES (?,?);", values: [ 1, 'test1', ] },
        { statement: "INSERT INTO test_table (remote_id, message) VALUES (?,?);", values: [ 2, 'test2', ] },
        { statement: "INSERT INTO test_table (remote_id, message) VALUES (?,?);", values: [ 3, 'test3', ] }
      ];
      const retSqlSet = await this.db.executeSet(setSql);
      console.log(`&&& retSet: ${JSON.stringify(retSqlSet)}`);
      var end = Date.now();
      this.count_end = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      console.log(`$$$ count_start: ${this.count_start}`)
      console.log(`$$$ count_end: ${this.count_end}`)
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      msg = `issue#479  time: ${diff}s for ${this.count_end} values`;
      this.messageList.push(msg);
      const updSql = [
        { statement:"UPDATE test_table SET message = ? WHERE remote_id = ?;",
        values:['update test1',1]
        },
        { statement:"UPDATE test_table SET message = ? WHERE remote_id = ?;",
        values:['update test2',2]
        },
        { statement:"UPDATE test_table SET message = ? WHERE remote_id = ?;",
        values:['update test3',3]
        }
      ];
      this.count_start = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      var start = Date.now()
      const retUpdSet = await this.db.executeSet(updSql);
      console.log(`&&& retSet: ${JSON.stringify(retUpdSet)}`);
      var end = Date.now();
      this.count_end = (await this.db.query("SELECT count(*) as count FROM test_table;")).values[0].count;
      console.log(`$$$ count_start: ${this.count_start}`)
      console.log(`$$$ count_end: ${this.count_end}`)
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      msg = `issue#479  time: ${diff}s for ${this.count_end} values`;
      this.messageList.push(msg);

*/

      console.log(`$$$ ${msg}`);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
