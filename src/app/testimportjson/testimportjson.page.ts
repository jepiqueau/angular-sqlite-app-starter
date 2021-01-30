import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { dataToImport, partialImport1, dataToImport2 } from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testimportjson',
  templateUrl: 'testimportjson.page.html',
  styleUrls: ['testimportjson.page.scss']
})
export class TestimportjsonPage implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService,
                    private _detailService: DetailService) {}

  async ngAfterViewInit() {
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    // Initialize the CapacitorSQLite plugin
    console.log("%%%% in TestimportjsonPage this._sqlite " + 
                                                  this._sqlite)

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
      let result: any = await this._sqlite.echo("Hello World");
      console.log(" from Echo " + result.value);

      // ************************************************
      // Create Database from imported Json
      // ************************************************

      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(dataToImport));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid failed"));
      }
      console.log("$$$ dataToImport Json Object is valid $$$")
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(dataToImport));    
      console.log(`full import result ${result.changes.changes}`);
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' dataToImport failed"));


      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("db-from-json", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection 'db-from-json' failed"));

      // open db "db-from-json"
      await db.open();

      // create synchronization table 
      result = await db.createSyncTable();
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      result = await db.getSyncDate();
      if(result.length === 0) return Promise.reject(new Error("GetSyncDate failed"));
      console.log("$$ syncDate " + result);

      // select all users in db
      result = await db.query("SELECT * FROM users;");
      if(result.values.length !== 4 || 
                    result.values[0].name !== "Whiteley" ||
                    result.values[1].name !== "Jones" ||
                    result.values[2].name !== "Simpson" ||
                    result.values[3].name !== "Brown"  ) {
        return Promise.reject(new Error("Query 4 Users failed"));
      }

      // close the connection
      await this._sqlite.closeConnection("db-from-json"); 

      // partial import
      result = await this._sqlite
                        .importFromJson(JSON.stringify(partialImport1));
      console.log(`partial import result ${result.changes.changes}`);
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'partial' partialImport1 failed"));
      // create the connection to the database
      db = await this._sqlite
                        .createConnection("db-from-json", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection 'db-from-json' after 'partial' failed"));

      // open db "db-from-json"
      await db.open();

      result = await db.getSyncDate();
      if(result.length === 0) return Promise.reject(new Error("GetSyncDate failed"));
      console.log("$$ syncDate " + result);

      // select all users in db
      result = await db.query("SELECT * FROM users;");
      console.log(`result.values ${JSON.stringify(result)}`)
      if(result.values.length !== 6 || 
                    result.values[0].name !== "Whiteley" ||
                    result.values[1].name !== "Jones" ||
                    result.values[2].name !== "Simpson" ||
                    result.values[3].name !== "Brown" ||
                    result.values[4].name !== "Addington" ||
                    result.values[5].name !== "Bannister" ) {
        return Promise.reject(new Error("Query 6 Users failed"));
      }
      // select all messages in db
      result = await db.query("SELECT * FROM messages;");
      console.log(`result.values ${JSON.stringify(result)}`)
      if(result.values.length !== 4|| 
                    result.values[0].title !== "test post 1" ||
                    result.values[1].title !== "test post 2" ||
                    result.values[2].title !== "test post 3" ||
                    result.values[3].title !== "test post 4" ) {
        return Promise.reject(new Error("Query 4 Messages failed"));
      }


      // select all images in db
      result = await db.query("SELECT * FROM images;");
      console.log(`result.values ${JSON.stringify(result)}`)
      if(result.values.length !== 2 || 
                    result.values[0].name !== "feather" ||
                    result.values[1].name !== "meowth" ) {
        return Promise.reject(new Error("Query 2 Images failed"));
      }

      // close the connection
      await this._sqlite.closeConnection("db-from-json"); 

      this._detailService.setExportJson(true);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
