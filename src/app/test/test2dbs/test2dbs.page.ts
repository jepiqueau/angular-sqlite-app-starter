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
        if(this._sqlite.platform !== 'web') {
          const isInConfigEncryption: boolean = (await this._sqlite.isInConfigEncryption()).result;
          console.log(`$$$ this._sqlite.isInConfigEncryption ${isInConfigEncryption}`)
          if(isInConfigEncryption) {
            db1 = await this._sqlite
                    .createConnection("testSet", true, "secret", 1);
          } else {
            db1 = await this._sqlite
                  .createConnection("testSet", false, "no-encrytion", 1);
          }
        } else {
          db1 = await this._sqlite
          .createConnection("testSet", false, "no-encrytion", 1);
        }
      }
      console.log(`before deleteDatabase`);
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
      console.log(`after schema creation`)
      // create synchronization table
      ret = await db.createSyncTable();

      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);
      console.log(`after setSyncDate`)

      // delete users if any from previous run
      let delUsers = `DELETE FROM users;`;
      ret = await db.execute(delUsers);
      console.log(`after execute DELETE FROM USERS`)

      // add two users in db
      ret = await db.execute(twoUsers, true, false);
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute 2 users failed"));
      }
      console.log(`after execute two USERS`)
      // Test math functions
      const sqlMath = "INSERT INTO users (name,email,age) VALUES ('Jeepq','jeepq@example.com',45);";
      const retMath = await db.run(sqlMath, [], false, 'no', false);
      console.log(`&&&& retMath: ${JSON.stringify(retMath.changes)} &&&&`);

      // select all users in db
      ret = await db.query("SELECT * FROM users;");
      if(ret.values.length !== 3 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones" ||
                                    ret.values[2].name !== "Jeepq") {
        return Promise.reject(new Error("Query 2 users failed"));
      }
      // test issue#378
      const ret378 = await db.run("UPDATE users SET age = ? WHERE id = ?", [45.3, 1], false);
      console.log(`&&&& ret378: ${JSON.stringify(ret378.changes)} &&&&`);
      console.log(`&&&& ret378.changes.changes: ${ret378.changes.changes} &&&&`);
      console.log(`&&&& ret378: ${ret378.changes.lastId} &&&&`);
      console.log(`&&&& ret378: ${ret378.changes.values} &&&&`);

      if (ret378.changes.changes <= 0) {
        return Promise.reject(new Error("Run issue#378 users failed"));
      }

      // open db testSet
      await db1.open();

      // create tables in db1
      ret = await db1.execute(createSchemaContacts);

      // load setContacts in db1
      ret = await db1.executeSet(setContacts);
      console.log(`ExecuteSet 5: ${JSON.stringify(ret)}`);
      if (ret.changes.changes !== 5) {
        return Promise.reject(new Error("ExecuteSet 5 contacts failed"));
      }

      // test issue170
      console.log(`Start Issue170`)
      ret = await db1.executeSet(setIssue170);
      console.log(`ExecuteSet 6: ${JSON.stringify(ret)}`);
      if (ret.changes.changes !== 1) {
        return Promise.reject(new Error("ExecuteSet 6 issue170 failed"));
      }
      if(this._sqlite.platform !== 'web') {
        const isDbEncrypt = (await this._sqlite.isDatabaseEncrypted("testNew")).result;
        const isDb1Encrypt = (await this._sqlite.isDatabaseEncrypted("testSet")).result;
        console.log(`&&&& isDbEncrypt: ${isDbEncrypt} isDb1Encrypt ${isDb1Encrypt} &&&&`);
      }
      // select users where company is NULL in db
      ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
      console.log(`Query 2 ret.values.length: ${ret.values.length}`)
      if(ret.values.length !== 3 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones"||
                                    ret.values[2].name !== "Jeepq") {
        return Promise.reject(new Error("Query 2 users where company is null failed"));
      }
      // add one user with statement and values
      let sqlcmd: string =
                  "INSERT INTO users (name,email,age,size,company) VALUES (?,?,?,?,?)";
      let values: Array<any>  = ["Simpson","Simpson@example.com",69,1.82,null];
      ret = await db.run(sqlcmd,values);
      console.log(`@@@@ Run 1: ${JSON.stringify(ret)}`);
      if(ret.changes.lastId !== 4) {
        return Promise.reject(new Error("Run 1 users with statement & values failed"));
      }
      // add one user with statement
      sqlcmd = `INSERT INTO users (name,email,age,size,company) VALUES ` +
                                `("Brown","Brown@example.com",15,1.75,null)`;
      ret = await db.run(sqlcmd, [], true, 'no', false);
      if(ret.changes.lastId !== 5) {
        return Promise.reject(new Error("Run 1 users with statement failed"));
      }
      let delTest56 = `DELETE FROM test56;`;
      ret = await db.execute(delTest56, false);
      console.log(`$$$$$$$ after DELETE FROM test56`)
      // add some tests issue#56
      ret = await db.execute(twoTests, true, false);
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
      if(this.isNative) {
        ret = (await this._sqlite.isInConfigEncryption()).result;
        console.log(`isInConfigEncryption ret: ${ret}`);
        if (!ret) {
          return Promise.reject(new Error("isInConfigEncryption failed"));
        }
        ret = (await this._sqlite.isInConfigBiometricAuth()).result;
        console.log(`isInConfigEncryption ret: ${ret}`);
        if (ret) {
          return Promise.reject(new Error("isInConfigBiometricAuth failed"));
        }
        result = (await this._sqlite.getDatabaseList()).values;
        console.log(`test get Database List: ${JSON.stringify(result)}`)
        for(const dbName of result)  {
          const mDbName = dbName.includes("SQLite.db") ? dbName.split("SQLite.db")[0] : dbName;
          console.log(`@@@@ dbName: ${dbName}`)
          const isEncrypt = (await this._sqlite.isDatabaseEncrypted(mDbName)).result;
          console.log(`Database: ${dbName} is encrypted: ${isEncrypt}`)
        }
        // test issue#448

        let db2: SQLiteDBConnection;
        const retCC = (await this._sqlite.checkConnectionsConsistency()).result;
        let isConn = (await this._sqlite.isConnection("testIssue448")).result;
        if(retCC && isConn) {
          db2 = await this._sqlite.retrieveConnection("testIssue448");
        } else {
          db2 = await this._sqlite
                    .createConnection("testIssue448", false, "no-encryption", 1);
        }
        // open db testNew
        await db2.open();

        const sql448 = `
          CREATE VIRTUAL TABLE if not exists docToolTextSearch USING fts3(body, id, page);
          INSERT INTO docToolTextSearch (body,id,page) VALUES('FLIGHT MANUAL EC 135 T1 CDS   Emergency and Malfunction Procedures   CAUTION INDICATIONS   ENG MANUAL   or   SYSTEM I   SYSTEM II   Conditions/Indications   Engine MANUAL mode has been selected by setting ENG MODE SEL sw from NORM to   MAN   NOTE    If ENG MANUAL comes together with TWIST GRIP refer to TWIST GRIP cau-   tion indication   Following functions of the respective engine are inoperative       automatic acceleration deceleration during power collective changes   N   1    limiter   NORM start is impossible   Procedure   WARNING    OPERATE THE TWIST GRIP WITH GREAT CARE AND AVOID QUICK TWIST   GRIP ROTATIONS   HOLD MIN 10 TORQUE ON THE NORMAL ENGINE TO MAINTAIN   AUTOMATIC CONTROL OF N   RO      The ENG MANUAL mode may be used for training of the FADEC FAIL procedure   After training is completed return to NORM mode   Respective ENG MODE SEL selector sw   Respective TWIST GRIP   ENG MANUAL caution   TWIST GRIP caution   Wait 10 sec before any power variation   Correct operation in NORM mode   NORM   Turn gradually to NEUTRAL   position   Check off   Verify by small collective   movements   3 - 18   APPROVED   Rev 33   ', '5983270909465803','120');
        `;
        ret = await db2.execute(sql448);
        console.log(`sql448 ret: ${JSON.stringify(ret)}`);
        const batch = [
          { statement: "DROP TABLE docToolTextSearch;",
            values: []},
          { statement: "CREATE VIRTUAL TABLE if not exists docToolTextSearch USING fts3(body, id, page);",
            values: []},
          { statement: "INSERT INTO docToolTextSearch (body,id,page) VALUES (?,?,?);",
            values:['FLIGHT MANUAL EC 135 T1 CDS   Emergency and Malfunction Procedures   CAUTION INDICATIONS   ENG MANUAL   or   SYSTEM I   SYSTEM II   Conditions/Indications   Engine MANUAL mode has been selected by setting ENG MODE SEL sw from NORM to   MAN   NOTE    If ENG MANUAL comes together with TWIST GRIP refer to TWIST GRIP cau-   tion indication   Following functions of the respective engine are inoperative       automatic acceleration deceleration during power collective changes   N   1    limiter   NORM start is impossible   Procedure   WARNING    OPERATE THE TWIST GRIP WITH GREAT CARE AND AVOID QUICK TWIST   GRIP ROTATIONS   HOLD MIN 10 TORQUE ON THE NORMAL ENGINE TO MAINTAIN   AUTOMATIC CONTROL OF N   RO      The ENG MANUAL mode may be used for training of the FADEC FAIL procedure   After training is completed return to NORM mode   Respective ENG MODE SEL selector sw   Respective TWIST GRIP   ENG MANUAL caution   TWIST GRIP caution   Wait 10 sec before any power variation   Correct operation in NORM mode   NORM   Turn gradually to NEUTRAL   position   Check off   Verify by small collective   movements   3 - 18   APPROVED   Rev 33   ', '5983270909465803','120']
          },
        ];
        ret = await db2.executeSet(batch);
        console.log(`batch ret: ${JSON.stringify(ret)}`);
        await this._sqlite.closeConnection("testIssue448");
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
