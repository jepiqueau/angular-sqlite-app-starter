import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { schemaToImport245V1, schemaToImport245V2} from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson245',
  templateUrl: 'testjson245.page.html',
  styleUrls: ['testjson245.page.scss']
})
export class Testjson245Page implements AfterViewInit {
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
      // Import Json Object V1 Issue#245
      // ************************************************
      // test Full Json object V1 validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(schemaToImport245V1));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid V1 Full failed"));
      }
      // full import 
      result = await this._sqlite
                          .importFromJson(JSON.stringify(schemaToImport245V1));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson V1 'full' failed"));
      console.log(`>>> Import V1 changes: ${result.changes.changes}`);

      // create the connection to the database
      let db = await this._sqlite
                        .createConnection("product-db", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection product-db V1 failed"));

      // open db product-db
      await db.open();

      // create synchronization table 
      result = await db.createSyncTable();
      if (result.changes.changes < 0) return Promise.reject(new Error("CreateSyncTable failed"));


      result = await db.getSyncDate();
      if(result.length === 0) return Promise.reject(new Error("GetSyncDate failed"));
      
      
      // select all vendors in db
      let ret: any = await db.query('SELECT company_name FROM vendors;');
      if(ret.values.length !== 3 || ret.values[0].company_name !== 'Devdactic' ||
                                    ret.values[1].company_name !== 'Ionic Academy'||
                                    ret.values[2].company_name !== 'Ionic Company') {
        return Promise.reject(new Error("Query vendors V1 failed"));
      }

      // select all products in db
      ret = await db.query("SELECT name FROM products;");
      if(ret.values.length !== 4 || ret.values[0].name !== 'Devdactic Fan Hat' ||
                                    ret.values[1].name !== 'Ionic Academy Membership' ||
                                    ret.values[2].name !== 'Ionic Sticker Swag' ||
                                    ret.values[3].name !== 'Practical Ionic Book') {
        return Promise.reject(new Error("Query products V1 failed"));
      }
      ret = await db.getTableList();
      console.log(`>>> ret TableList ${JSON.stringify(ret)}`);
      if(ret.values.length !== 2 || ret.values[0] !== 'products' ||
                    ret.values[1] !== 'vendors') {
        return Promise.reject(new Error("GetTableList V1 failed"));
      }
      // close the connection
      await this._sqlite.closeConnection("product-db");

      // ************************************************
      // Try to Import again Json Object V1 Issue#245
      // ************************************************
      // full import 
      if (Object.keys(schemaToImport245V1).includes("overwrite")) {
        schemaToImport245V1.overwrite = false;
      }
      result = await this._sqlite
                          .importFromJson(JSON.stringify(schemaToImport245V1));    
      console.log(`>>> Re-Import V1 changes: ${result.changes.changes}`);
      if(result.changes.changes != 0 ) return Promise.reject(new Error("Re-ImportFromJson V1 'full' failed"));
      schemaToImport245V1.overwrite = true;

      // ************************************************
      // Import Json Object V2 Issue#245
      // ************************************************
      // test Full Json object V2 validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(schemaToImport245V2));
      console.log(`IsJsonValid V2: ${JSON.stringify(result)}`)                      
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid V2 Full failed"));
      }

      // full import 
      result = await this._sqlite
                          .importFromJson(JSON.stringify(schemaToImport245V2));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson V2 'full' failed"));
      console.log(`>>> Import V2 changes: ${result.changes.changes}`);

      // create the connection to the database
      db = await this._sqlite
                        .createConnection("product-db", false,
                                          "no-encryption", 2);
      if(db === null) return Promise.reject(new Error("CreateConnection product-db V2 failed"));

      // open db product-db
      await db.open();
      // Set the new synchronization date
      await db.setSyncDate(`${(new Date()).toISOString().substring(0,24)}`);

      // select all vendors email in db
      ret = await db.query('SELECT company_email FROM vendors;');
      if(ret.values.length !== 3 || ret.values[0].company_email !== 'devdactic@example.com' ||
                                    ret.values[1].company_email !== 'ionic.academy@example.com'||
                                    ret.values[2].company_email !== 'ionic@example.com') {
        return Promise.reject(new Error("Query vendors V2 failed"));
      }
      const queryStmt = `SELECT vendors.company_name AS company,
          COUNT(products.vendorid) AS nb_products from products
          INNER JOIN vendors ON vendors.id = products.vendorid
          GROUP BY products.vendorid ORDER BY company;`;
      ret = await db.query(queryStmt);
      if(ret.values.length !== 3 || ret.values[0].nb_products !== 2 ||    
          ret.values[1].nb_products !== 1 || ret.values[2].nb_products !== 1) {
        return Promise.reject(new Error("Query count products V2 failed"));
      }

      // delete the db
      await db.delete();
      
      // ************************************************
      // Export Json Object from an Existing Database
      // ************************************************
/*
      // export json full
      let jsonObj: any = await db.exportToJson('full');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }

      // export json partial
      jsonObj = await db.exportToJson('partial');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'partial' failed"));
      }
*/
      // close the connection
      await this._sqlite.closeConnection("product-db");
      return Promise.resolve();
    } catch (err) {
      // close the connection
      await this._sqlite.closeConnection("product-db");
      return Promise.reject(err);
    }
  

  }

}
