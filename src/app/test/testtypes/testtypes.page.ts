import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';

import { createSchema, firstTeachers, partialImport } from '../utils/types-test-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-testtypes',
  templateUrl: 'testtypes.page.html',
  styleUrls: ['testtypes.page.scss']
})
export class TestTypesPage implements AfterViewInit {
  detail: boolean = false;
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;
  importListener: any;
  exportListener: any;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {}

  async ngAfterViewInit() {
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    this.platform = this._sqlite.platform;
    if( this.platform !== 'electron') {
      const showProgessToast = async (message: string) => {
        await Toast.show({
          text: message,
          duration: 'short',
          position: 'top'
        });
      };
      console.log(this._sqlite);
      this.importListener = await this._sqlite.sqlitePlugin.addListener('sqliteImportProgressEvent', (info: any) => {
        showProgessToast(info.progress)
      });
      this.exportListener = await this._sqlite.sqlitePlugin.addListener('sqliteExportProgressEvent', (info: any) => {
        showProgessToast(info.progress)
      });
    }
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

  ngOnDestroy() {
    if( this.platform !== 'electron') {
      this.importListener.remove();
      this.exportListener.remove();
    }
  }

  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");

      var retDict: Map<string, any> = await this._sqlite.retrieveAllConnections();
/*      for (var conn in retDict) {
        console.log(`connection: ${conn}`)
      }
*/
      // initialize the connection
      let db: SQLiteDBConnection;
      if((await this._sqlite.isConnection("testTypes.db")).result) {
        db = await this._sqlite.retrieveConnection("testTypes.db");
      } else 
        db = await this._sqlite
                  .createConnection("testTypes.db", false, "no-encryption", 1);
      // check if the databases exist 
      // and delete it for multiple successive tests
      await deleteDatabase(db);

      // open db testNew
      await db.open();

      // create tables in db
      let ret: any = await db.execute(createSchema,false);
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }

      // create synchronization table 
      ret = await db.createSyncTable();
      
      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      // add first teachers in db
      ret = await db.execute(firstTeachers, false);
      if (ret.changes.changes !== 2) {
        return Promise.reject(new Error("Execute 2 teachers failed"));
      }
      // select all teachers in db
      ret = await db.query("SELECT * FROM teachers;");
      if(ret.values.length !== 2 || ret.values[0].name !== "Brown" ||
                                    ret.values[1].name !== "Dupont") {
        return Promise.reject(new Error("Query 1 teachers failed"));
      }
      // update age with statement and values              
      let sqlcmd: string =
                  "UPDATE teachers SET age = ?, office = ? WHERE id = ?;";
      let values: Array<any>  = [41,"ABC",1];
      ret = await db.run(sqlcmd, values, false);
      values = [23,"AEF",2];
      ret = await db.run(sqlcmd, values, false);

      // select all teachers in db
      ret = await db.query("SELECT * FROM teachers;");

      // select teachers where age > 40 in db
      sqlcmd = "SELECT name,email,age FROM teachers WHERE age > ?";
      ret = await db.query(sqlcmd,[40]);
      if(ret.values.length !== 1 || ret.values[0].name !== "Brown" ) {
        return Promise.reject(new Error("Query 2 teachers failed"));
      }
      // close the connection
      await this._sqlite.closeConnection("testTypes.db"); 

      // partial import
      result = await this._sqlite
                        .importFromJson(JSON.stringify(partialImport));
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'partial' partialImport1 failed"));
      // create the connection to the database
      db = await this._sqlite
                        .createConnection("testTypes.db", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection 'testTypes.db' after 'partial' failed"));

      // open db "testTypes"
      await db.open();

      // select teachers with "office" is null
      sqlcmd = "SELECT * FROM teachers where office IS NULL;";
      result = await db.query(sqlcmd);
      if(result.values.length !== 1 || 
                    result.values[0].name !== "MacLaren") {
        return Promise.reject(new Error("Query 3 Teachers failed"));
      }

      // export full json
      let jsonObj: any = await db.exportToJson('full');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }

      if( jsonObj.export.database != "testTypes" || jsonObj.export.version != 1 
          || jsonObj.export.mode != "full" || jsonObj.export.tables.length != 2) {
        return Promise.reject(new Error("Export Json failed"));
      }

      // Import exported json object
      jsonObj.export.database = "testTypesImported";
      result = await this._sqlite
                        .importFromJson(JSON.stringify(jsonObj.export));
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));
      // create the connection to the database
      db = await this._sqlite
                        .createConnection("testTypesImported", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection 'testTypesImported' after 'full' failed"));

      // open db "testTypesImported"
      await db.open();

      // select all teachers in db
      ret = await db.query("SELECT * FROM teachers;");
      if(ret.values.length !== 5 || ret.values[0].name !== "Brown" ||
                                    ret.values[1].name !== "Dupont" ||
                                    ret.values[2].name !== "MacLaren" ||
                                    ret.values[3].name !== "Bannister" ||
                                    ret.values[4].name !== "Jones" ) {
        return Promise.reject(new Error("Query 4 teachers failed"));
      }

      // select all classess in db
      ret = await db.query("SELECT * FROM classes;");
      if(ret.values.length !== 3 || ret.values[0].courseCode !== 1 ||
                                    ret.values[0].dayOfWeek != "Monday" ||
                                    ret.values[1].courseCode !== 2 ||
                                    ret.values[1].dayOfWeek != "Wednesday" ||
                                    ret.values[2].courseCode !== 1 ||
                                    ret.values[2].dayOfWeek != "Friday") {
        return Promise.reject(new Error("Query 5 classes failed"));
      }

      // Check Connections Consistency
      ret= await this._sqlite.checkConnectionsConsistency();
      if(!ret.result) {
        return Promise.reject(new Error("You must redefined your connections"));
      }

      result = await this._sqlite.isConnection("testTypes");
      if(result.result) {
        // close the connection testTypes
        await this._sqlite.closeConnection("testTypes"); 
      }    

      result = await this._sqlite.isConnection("testTypesImported");
      if(result.result) {
        // close the connection testTypesImported
        await this._sqlite.closeConnection("testTypesImported");      
      }
    
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
