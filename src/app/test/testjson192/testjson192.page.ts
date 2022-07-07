import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson192',
  templateUrl: 'testjson192.page.html',
  styleUrls: ['testjson192.page.scss']
})
export class Testjson192Page implements AfterViewInit {
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
    try{
      await this.runTest();
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } catch (err) {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log("$$$ runTest failed");
      await showAlert(err.message);
    }
  }


  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");
      const JSONSchema = { 
        database: 'storage-192', 
        version: 1, 
        encrypted: false, 
        mode: 'full', 
        tables: [ 
          { name: 'routes', 
            schema: [ 
              { column: 'id', value: 'TEXT NOT NULL'},
              { column: 'name', value: 'TEXT NOT NULL' }, 
              { column: 'date', value: 'TEXT NOT NULL' }, 
              { constraint: 'routes_pk', value: 'PRIMARY KEY (id)'},
            ], 
            indexes: [ 
              { name: 'routes_id_uindex', value: 'id' }, 
              { name: 'routes_name_uindex', value: 'name' }, 
            ], 
          }, 
          { name: 'route_points', 
            schema: [ 
              { column: 'id', value: 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL' },
              { column: 'route_id', value: 'TEXT NOT NULL' }, 
              { column: 'accuracy', value: 'REAL' }, 
              { column: 'altitude', value: 'REAL' }, 
              { column: 'altitudeAccuracy', value: 'REAL' }, 
              { column: 'heading', value: 'REAL' }, 
              { column: 'latitude', value: 'REAL' }, 
              { column: 'longitude', value: 'REAL' }, 
              { column: 'speed', value: 'REAL' }, 
              { column: 'TIMESTAMP', value: 'INTEGER' }, 
              { foreignkey: 'route_id', value: 'REFERENCES routes(id) ON DELETE CASCADE', }, 
            ], 
            indexes: [ 
              { name: 'route_points_id_uindex', value: 'id' }, 
            ], 
          }, 
        ], 
      };
      // ************************************************
      // Import Json Object Issue#71
      // ************************************************
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(JSONSchema));
      if(!result.result) {
        return Promise.reject(new Error("IsJson failed"));
      }
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(JSONSchema));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));

      // ************************************************
      // Query
      // ************************************************

      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("storage-192", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection storage-192 failed"));

      // open db testNew
      await db.open();
      const tableQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='routes';`;
      const tableResult = await db.query(tableQuery); 
      if (tableResult.values.length === 0) { 
        console.log('table bestaat niet') 
        const result = await this._sqlite.isJsonValid(JSON.stringify(JSONSchema)); 
        console.log(result) 
        if(!result.result) { 
          return Promise.reject(new Error(`isJsonValid: "schemaToImport179" is not valid`));
        } 
        const resJson = await this._sqlite.importFromJson(JSON.stringify(JSONSchema)); 
        console.log(resJson) 
        if(resJson.changes && resJson.changes.changes && resJson.changes.changes < 0) { 
          return Promise.reject(new Error(`importFromJson: "full" failed`)); 
        }
      }
      // close the connection
      await this._sqlite.closeConnection("storage-192"); 

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  

  }

}
