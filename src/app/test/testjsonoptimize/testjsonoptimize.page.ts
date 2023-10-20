import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjsonoptimize',
  templateUrl: 'testjsonoptimize.page.html',
  styleUrls: ['testjsonoptimize.page.scss']
})
export class TestjsonoptimizePage implements AfterViewInit {
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

  randomInt() {
    return Math.floor(Math.random() * (81 - 20) + 20);
  }
  randomDouble() {
    return (Math.random() * (2.11 - 1.50) + 1.50).toFixed(2);
  }
  randomDelete() {
    // Generate 95% of 0
    // Generate a random number between 0 and 1
    var randomNumber = Math.random();

    // If the random number is less than 0.95, return 0, else return 1
    if (randomNumber < 0.95) {
        return 0;
    } else {
        return 1;
    }

  }
  async runTest(): Promise<void> {
    const jsonImport = {
      database : "db-opt-json",
      version : 1,
      overwrite: true,
      encrypted : false,
      mode : "full",
      tables :[
        {
            name: "contacts",
            schema: [
                {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
                {column:"email", value:"TEXT UNIQUE NOT NULL"},
                {column:"name", value:"TEXT"},
                {column:"age", value:"INTEGER"},
                {column:"size", value:"FLOAT"},
                {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
                {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
            ],
            indexes: [
                {name: "index_contacts_on_name",value: "name"},
                {name: "index_contacts_on_last_modified",value: "last_modified DESC"},
                {name: "index_contacts_on_email_name", value: "email ASC, name", mode: "unique"}
            ],
            triggers: [
              {
                name: "contacts_trigger_last_modified",
                timeevent: "AFTER UPDATE",
                logic: `FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
                  BEGIN
                    UPDATE contacts SET last_modified = (strftime('%s', 'now')) WHERE id=NEW.id;
                  END;
                `
              }
            ],
            values: [
            ]
        },
      ]
    }
    const currentDate = new Date();
    const dbyTimestamp = Math.floor((currentDate.getTime() - (48 * 60 * 60 * 1000)) / 1000);
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);

    const dataVal = [];
    for (var i=0;i<this.nData;i++) {
      const row = [i,`name${i}@example.com`,`name${i}`,this.randomInt(),this.randomDouble(),0, dbyTimestamp];
      dataVal.push(row);
    }
    jsonImport.tables[0].values = dataVal;
    console.log('jsonImport: ', JSON.stringify(jsonImport));
    try {

      // *********************
      // Import Json Object
      // *********************
      // test Full Json object validity
      let isValid = (await this._sqlite
                            .isJsonValid(JSON.stringify(jsonImport))).result;
      console.log(`isJsonValid ${isValid} `)
      if(!isValid) {
        return Promise.reject(new Error("IsJsonValid testJsonOptimize Full failed"));
      }
      var start = Date.now()
      console.log(`start : ${start}`)

      let result = await this._sqlite
                          .importFromJson(JSON.stringify(jsonImport));
      console.log(`importFromJson ${JSON.stringify(result)} `)
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson V1 'full' failed"));
      console.log(`>>> Import testJsonOptimize changes: ${result.changes.changes}`);
      var end = Date.now();
      console.log(`start : ${start}`)
      console.log(`end : ${end}`)
      var diff = (end - start) / 1000;
      const msg = `import from json  time: ${diff}s for ${this.nData} values`;
      this.messageList.push(msg);

      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("db-opt-json", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-opt-json failed"));

      // open db db-opt-json
      await db.open();

      // create synchronization table
      result = await db.createSyncTable();
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));
      let retSync = await db.getSyncDate();
      if(retSync.length === 0) return Promise.reject(new Error("GetSyncDate failed"));
      console.log(`&&& retSync: ${JSON.stringify(retSync)}`)
      await db.setSyncDate(yesterdayDate.toISOString());

      retSync = await db.getSyncDate();
      if(retSync.length === 0) return Promise.reject(new Error("GetSyncDate failed"));
      console.log(`&&&&& retSync: ${JSON.stringify(retSync)}`)


      // select count in db
      let ret: any = await db.query('SELECT count(*) as count FROM contacts;');
      if(ret.values.length !== 1 || ret.values[0].count !== this.nData) {
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
