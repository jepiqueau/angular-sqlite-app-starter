import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { testIssue292} from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson292',
  templateUrl: 'testjson292.page.html',
  styleUrls: ['testjson292.page.scss']
})
export class Testjson292Page implements AfterViewInit {
  public inbox: any[] = [];
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

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


  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");

      // ************************************************
      // Import Json Object Issue#292
      // ************************************************
      // test Full Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(testIssue292));
      console.log(`isJsonValid ${result.result} `)
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid testIssue292 Full failed"));
      }
      // full import 
      result = await this._sqlite
                          .importFromJson(JSON.stringify(testIssue292));    
      console.log(`importFromJson ${JSON.stringify(result)} `)
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson V1 'full' failed"));
      console.log(`>>> Import testIssue292 changes: ${result.changes.changes}`);

      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("db-issue292", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-issue292 failed"));

      // open db db-issue292
      await db.open();

      // create synchronization table 
      result = await db.createSyncTable();
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      result = await db.getSyncDate();
      if(result.length === 0) return Promise.reject(new Error("GetSyncDate failed"));
      
      
      // select inbox in db
      let ret: any = await db.query('SELECT * FROM inbox;');
      if(ret.values.length !== 4 || ret.values[0].id !== 1 ||
                                    ret.values[1].id !== 2 ||
                                    ret.values[2].id !== 3 ||
                                    ret.values[3].id !== 4) {
        return Promise.reject(new Error("Query inbox failed"));
      }

      this.inbox = [...ret.values];

      console.log(`this.inbox \n ${JSON.stringify(this.inbox)}`);

      // ************************************************
      // Export Json Object from an Existing Database
      // ************************************************

      // export json full
      let jsonObj: any = await db.exportToJson('full');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }

      console.log(`Json returned from Full Export \n ${JSON.stringify(jsonObj.export)}`);

      // close the connection
      await this._sqlite.closeConnection("db-issue292");
      return Promise.resolve();
    } catch (err) {
      // close the connection
      const isConn = (await this._sqlite.isConnection("db-issue292")).result;
      if(isConn) await this._sqlite.closeConnection("db-issue292");
      return Promise.reject(err);
    }
  

  }

}
