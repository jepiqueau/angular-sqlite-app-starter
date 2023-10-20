import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjsonimportdelete',
  templateUrl: 'testjsonimportdelete.page.html',
  styleUrls: ['testjsonimportdelete.page.scss']
})
export class TestjsonimportdeletePage implements AfterViewInit {
  public messageList: string[] = [];
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;
  nData = 10000;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    try{
      await this.runTest();
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } catch (err) {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      let msg: string = err.message ? err.message : err;
      await showAlert(msg);
      console.log(`$$$ runTest failed ${msg}`);
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
  async runTest(): Promise<void> {
    try {

      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("db-opt-json", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-opt-json failed"));

      // open db db-opt-json
      await db.open();

      // select count in db
      let ret: any = await db.query('SELECT count(*) as count FROM contacts;');
      if(ret.values.length !== 1 || ret.values[0].count !== this.nData) {
        return Promise.reject(new Error("Query contacts failed"));
      }
      //Delete some Data
      const delStmt = "DELETE FROM contacts WHERE id IN (1,10,500,550);"
      const retDel = await db.run(delStmt);
      ret = await db.query('SELECT count(*) as count FROM contacts WHERE sql_deleted = 0;');
      if(ret.values.length !== 1 || ret.values[0].count !== this.nData - 4) {
        return Promise.reject(new Error("Query contacts after delete failed"));
      }
      // ************************************************
      // Full Export json
      // ************************************************
      let jsonObj: any = await db.exportToJson('partial');
      console.log(`jsonObj ${JSON.stringify(jsonObj.export)}`)
      console.log(`jsonObj.export.database: ${jsonObj.export.database} `)
      // test Json object validity
      let isValid = (await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export))).result;
      if(!isValid) {
        return Promise.reject(new Error("IsJsonValid 'full' export failed "));
      }

      jsonObj.export.overwrite = false;
      // close connnection
      await this._sqlite.closeConnection("db-opt-json");

      // *******************************
      // Import the exported Json Object
      // *******************************
      await this.delay(4,'before importing jsonObj')

      var start = Date.now()
      console.log(`start : ${start}`)

      let result = await this._sqlite
                          .importFromJson(JSON.stringify(jsonObj.export));
      console.log(`importFromJson ${JSON.stringify(result)} `)
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson V1 'full' failed"));
      console.log(`>>> Import 2 testJsonOptimize changes: ${result.changes.changes}`);
      var end = Date.now();
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      const msg2 = `import from json  time: ${diff}s for ${this.nData} values`;
      this.messageList.push(msg2);

      // create the connection to the database
      db = await this._sqlite.createConnection("db-opt-json", false,
                        "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-opt-json failed"));

      // open db db-opt-json
      await db.open();
      // select count in db
      ret = await db.query('SELECT count(*) as count FROM contacts;');
      if(ret.values.length !== 1 || ret.values[0].count !== this.nData - 4) {
        return Promise.reject(new Error("Query contacts failed"));
      }

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      // close the connection
      const isConn = (await this._sqlite.isConnection("db-opt-json")).result;
      if(isConn) await this._sqlite.closeConnection("db-opt-json");
    }


  }

}
