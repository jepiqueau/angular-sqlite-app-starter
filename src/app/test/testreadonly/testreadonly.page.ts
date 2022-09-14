import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';

import { createSchema, twoUsers, twoTests } from '../utils/no-encryption-utils';
import { createSchemaContacts} from '../utils/encrypted-set-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-testreadonly',
  templateUrl: 'testreadonly.page.html',
  styleUrls: ['testreadonly.page.scss']
})
export class TestReadonlyPage implements AfterViewInit {
  public userNumber = 0;
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
      const msg = err.message ? err.message : err;
      await showAlert(msg);
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
      // open connection read-write mode
      let isConn = (await this._sqlite.isConnection("testNew", false)).result;
      if(retCC && isConn) {
        db = await this._sqlite.retrieveConnection("testNew", false);
      } else {
        db = await this._sqlite
                  .createConnection("testNew", false, "no-encryption", 1, false);
      }
      console.log(`>>> after open testNew readwrite`)
      // check if the databases exist 
      // and delete it for multiple successive tests
      await deleteDatabase(db);

      // open db testNew
      let ret: any;
      await db.open();
      if(this._sqlite.getPlatform() != "android") {
        // set WAL mode 
        const walStmt = /*this._sqlite.getPlatform() === "electron" ? 'PRAGMA journal_mode=WAL;' : */'PRAGMA journal_mode=WAL2;';
        ret = await db.execute(walStmt,false);
      }
      // create tables in db
      ret = await db.execute(createSchema);
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
      console.log(`>>> after open testNew readwrite select`)

      // open connection read-only mode
      if(this._sqlite.getPlatform() === "web") {
        return Promise.reject("Readonly mode not yet implemented on Web");
      }
      isConn = (await this._sqlite.isConnection("testNew", true)).result
      console.log(`>>> after isConn testNew readonly ${isConn}`)

      if(retCC && isConn) {
        console.log(`>>> before retrieving testNew readonly`)
        db1 = await this._sqlite.retrieveConnection("testNew", true);
      } else {                          
        console.log(`>>> before creating testNew readonly`)
        db1 = await this._sqlite
                  .createConnection("testNew", false, "no-encryption", 1, true);
      }
      console.log(`>>> after retrieving testNew readonly`)
      const getUserNumber = async() => {
        this.userNumber = (await (db1.query("SELECT * FROM users;"))).values.length ; 
      }
  
      // open db1 testNew read-only mode
      await db1.open();
      console.log(`>>> after open testNew readonly`)
      // select all users in db
      ret = await db1.query("SELECT * FROM users;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
        return Promise.reject(new Error("Query 2 users failed from read-only"));
      }
      console.log(">>>>>> End of query db1")

      for (let i=0; i< 1000; i++) {
        const stmt = `INSERT INTO users (name,email,age) VALUES ("testname${i}","testemail${i}",${Math.random() * 105 +18});`;
        await db.execute(stmt, true); 
        if (i % 100 === 0) getUserNumber();
        if (i === 999) {
          getUserNumber();

          const retDict: Map<string, any> = await 
                                this._sqlite.retrieveAllConnections();
    
          console.log(`retDict: ${[...retDict.entries()]}`);
          // create tables in db1 
          // this should failed
/*         console.log(">>>>>> Go to execute providing a fail")
          ret = await db1.execute(createSchemaContacts);
          console.log(`>>>>>> ret resolve : ${JSON.stringify(ret)}`);
          await this._sqlite.retrieveAllConnections();
*/
          return Promise.resolve();  
        }
      }

    } catch (err) {
      console.log(`>>>>>> ret reject: ${JSON.stringify(err)}`);
      return Promise.reject(err);
    } finally {
      await this._sqlite.retrieveAllConnections();
      const retDict: Map<string, any> = await this._sqlite.retrieveAllConnections();
/*      console.log(`retDict: ${[...retDict.entries()]}`);
      await this._sqlite.closeConnection("testNew", true);
      const retDict1: Map<string, any> = await this._sqlite.retrieveAllConnections();
      console.log(`retDict1: ${[...retDict1.entries()]}`);
      await this._sqlite.closeConnection("testNew", false);
*/
      await this._sqlite.closeAllConnections();
      const retDict2: Map<string, any> = await this._sqlite.retrieveAllConnections();
      console.log(`retDict2: ${[...retDict2.entries()]}`);

    }

  }

}
