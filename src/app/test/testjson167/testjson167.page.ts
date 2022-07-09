import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';
import { dataToImport167, viewsToImport167 } from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson167',
  templateUrl: 'testjson167.page.html',
  styleUrls: ['testjson167.page.scss']
})
export class Testjson167Page implements AfterViewInit {
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

      // ************************************************
      // Import Json Object Issue#71
      // ************************************************
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(dataToImport167));
      if(!result.result) {
        return Promise.reject(new Error("IsJson failed"));
      }
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(dataToImport167));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));;
      // ************************************************
      // Export Json Object from an Existing Database
      // ************************************************

      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("db-issue167", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-issue167 failed"));

      // open db testNew
      await db.open();

      // create synchronization table 
      result = await db.createSyncTable();
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      const syncDate: string = await db.getSyncDate();
      if(syncDate.length === 0) return Promise.reject(new Error("GetSyncDate failed"));

      // select from view SalesTeam in db
      result = await db.query("SELECT * FROM SalesTeam;");
      if(result.values.length !== 4 || 
                    result.values[0]["last_name"] !== "Brown" ||
                    result.values[1]["last_name"] !== "Viras" ||
                    result.values[2]["last_name"] !== "Patel" ||
                    result.values[3]["last_name"] !== "Jariwala"  ) {
        return Promise.reject(new Error("Query SalesTeam failed"));
      }

      // select from view AdminTeam in db
      result = await db.query("SELECT * FROM AdminTeam;");
      if(result.values.length !== 2 || 
                    result.values[0]["last_name"] !== "Brown" ||
                    result.values[1]["last_name"] !== "Menpara" ) {
        return Promise.reject(new Error("Query AdminTeam failed"));
      }
      // close the connection
      await this._sqlite.closeConnection("db-issue167"); 

      // test Json object validity
      result = await this._sqlite.isJsonValid(JSON.stringify(viewsToImport167));
      if(!result.result) {
        return Promise.reject(new Error("IsJson viewsToImport167 failed"));
      }
      // partial import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(viewsToImport167));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));;
      // create the connection to the database
      db = await this._sqlite
                        .createConnection("db-issue167", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-issue167 failed"));

      // open db testNew
      await db.open();

      // select from view QualityControlTeam in db
      result = await db.query("SELECT * FROM QualityControlTeam;");
      if(result.values.length !== 3 || 
                    result.values[0]["last_name"] !== "Jariwala" ||
                    result.values[1]["last_name"] !== "Rana" ||
                    result.values[2]["last_name"] !== "Shah" ) {
        return Promise.reject(new Error("Query QualityControlTeam failed"));
      }
      // select from view Marketing in db
      result = await db.query("SELECT * FROM MarketingTeam;");
      if(result.values.length !== 2 || 
                    result.values[0]["last_name"] !== "Douglas" ||
                    result.values[1]["last_name"] !== "White" ) {
        return Promise.reject(new Error("Query Marketing failed"));
      }
    
      // export json
      let jsonObj: any = await db.exportToJson('full');
      console.log(`$$$ jsonObj ${JSON.stringify(jsonObj)}`)
      if(!jsonObj.export.tables || jsonObj.export.tables.length !== 2) {
        return Promise.reject(new Error("JsonObj tables not correct"));
      }
      if(!jsonObj.export.views || jsonObj.export.views.length !== 4) {
        return Promise.reject(new Error("JsonObj views not correct"));
      }
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }

      // close the connection
      await this._sqlite.closeConnection("db-issue167"); 

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  

  }

}
