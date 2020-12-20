import { Component } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';

@Component({
  selector: 'app-issue59',
  templateUrl: './issue59.component.html',
  styleUrls: ['./issue59.component.scss'],
})
export class Issue59Component {
  platform: string;
  issue59: boolean = false;
  initTest:boolean = false;
  initPlugin: boolean = false;
  retEx2: boolean = false;
  retEx3: boolean = false;
  retExportFull: boolean = false;
  retClose: boolean = false;
  retImport: boolean = false;
  retExport1Full: boolean = false;
  retClose1: boolean = false;

  constructor(private _SQLiteService: SQLiteService) {
    console.log(`isService ${this._SQLiteService.isService}`);
    this.initPlugin = this._SQLiteService.isService;
  }
  /*******************************
  * Component Methods           *
  *******************************/

  async runTests(): Promise<void> {
    console.log("****** entering run tests");
    // In case of multiple test runs
    this.resetDOM();
    // Start Running the Set of Tests
    const cardSQLite = document.querySelector('.card-issue59');
    if(cardSQLite && cardSQLite.classList.contains("hidden")) 
              cardSQLite.classList.remove('hidden');
    if(this.initPlugin) {
      this.initTest = await this.testInitialization();
      if (this.initTest) {
        // Create a Database with No-Encryption
        this.issue59 = await this.testIssue59();
        if(!this.issue59) {     
          document.querySelector('.sql-failure-issue59').classList
                  .remove('display');
        } else {
          console.log("***** End testDatabase *****");
          document.querySelector('.sql-success-issue59').classList
                  .remove('display');
        }
      }
    }
  }
  /**
  * Reset the DOM
  */
  async resetDOM(): Promise<void> {
    const cardSQLite = document.querySelector('.card-issue59');
    if(cardSQLite) {
      if (!cardSQLite.classList.contains("hidden")) cardSQLite.classList.add('hidden');
      for (let i:number=0;i< cardSQLite.childElementCount;i++) {
        if(!cardSQLite.children[i].classList.contains('display')) cardSQLite.children[i].classList.add('display');
      }
    }
  }

  /**
   * testInitialization
   */
  async testInitialization(): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.retEx2 = false;
      this.retEx3 = false;
      this.retExportFull = false;
      this.retClose = false;
      this.retImport = false;
      this.retExport1Full = false;
      this.retClose1 = false;
         
      const echo = await this._SQLiteService.getEcho("Hello from JEEP");
      console.log("*** echo ",echo);
      if(echo.value === "Hello from JEEP") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
  /**
  * Test a non-encrypted database
  */
  async testIssue59(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // check if the database test-json-db59 exists 
      let result: any = await this._SQLiteService.isDBExists("test-json-db59");
      console.log("isDBExists 'test-json-db59' " + JSON.stringify(result));
      if(result.result) {
          // open the DB
          let resOpen = await this._SQLiteService.openDB("test-json-db59"); 
          if(resOpen.result) {
            let resDel: any = await this._SQLiteService.deleteDB("test-json-db59");
            if(!resDel.result) {
              console.log("Error in deleting the database test-json-db59");
              resolve(false);
            }
          }
      } else {
        console.log("*** database test-json-db59 does not exist");
      }
      // check if the database product-db exists 
      result = await this._SQLiteService.isDBExists("product-db");
      console.log("isDBExists 'product-db' " + JSON.stringify(result));
      if(result.result) {
          // open the DB
          let resOpen = await this._SQLiteService.openDB("product-db"); 
          if(resOpen.result) {
            let resDel: any = await this._SQLiteService.deleteDB("product-db");
            if(!resDel.result) {
              console.log("Error in deleting the database product-db");
              resolve(false);
            }
          }
      } else {
        console.log("*** database product-db does not exist");
      }
      
      // open the database
      result = await this._SQLiteService.openDB("test-json-db59"); 
      if(result.result) {
        console.log("*** Database test-json-db59 Opened");
        document.querySelector('.openDB-issue59').classList.remove('display');
        result = await this._SQLiteService.createSyncTable();
        console.log("*** After createSyncTable " + result.changes.changes);
        // create tables
        const sqlcmd: string = `
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS countries (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT UNIQUE NOT NULL,
            code TEXT,
            language TEXT,
            phone_code TEXT,
            last_modified INTEGER DEFAULT (strftime('%s', 'now'))
        );
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            gender TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            national_id TEXT NOT NULL,
            date_of_birth TEXT,
            created_at TEXT,
            created_by TEXT,
            last_edited TEXT,
            organization TEXT,
            comment_id TEXT,
            country_id TEXT,
            last_modified INTEGER DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET DEFAULT
        );
        CREATE INDEX IF NOT EXISTS countries_index_name ON countries (name);
        CREATE INDEX IF NOT EXISTS countries_index_last_modified ON countries (last_modified);
        CREATE INDEX IF NOT EXISTS customers_index_last_name ON customers (last_name);
        CREATE INDEX IF NOT EXISTS customers_index_last_modified ON customers (last_modified);
        CREATE TRIGGER IF NOT EXISTS countries_trigger_last_modified
        AFTER UPDATE ON countries
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE countries SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
        END;
        CREATE TRIGGER IF NOT EXISTS customers_trigger_last_modified
        AFTER UPDATE ON customers
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE customers SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
        END;
        PRAGMA user_version = 1;
        COMMIT TRANSACTION;
        `;
        result = await this._SQLiteService.execute(sqlcmd);
        console.log("*** After createTables " + result.changes.changes);
        if(result.changes.changes === 0 || result.changes.changes === 1) {
            document.querySelector('.execute1-issue59').classList.remove('display'); 
            // Insert some Countries
            let sqlcmd: string = `
            BEGIN TRANSACTION;
            INSERT INTO countries (id,name,code,language,phone_code) VALUES ("3","Afghanistan","AF","fa","93");
            INSERT INTO countries (id,name,code,language,phone_code) VALUES ("6","Albania","AL","sq","355");
            INSERT INTO countries (id,name,code,language,phone_code) VALUES ("56","Algeria","DZ","ar","213");
            COMMIT TRANSACTION;
            `;
            result = await this._SQLiteService.execute(sqlcmd);
            console.log("*** After Insert countries " + result.changes.changes);
            this.retEx2 = result.changes.changes === 3 ? true : false;
            if(this.retEx2) document.querySelector('.execute2-issue59').classList.remove('display'); 
            sqlcmd = `
            BEGIN TRANSACTION;
            INSERT INTO customers (id,first_name,last_name,gender,email,
              phone,national_id,comment_id,country_id) VALUES (
              "3","William","Jones","1","peterjones@mail.com<peterjones@mail.com>","420305202","1234567",null,"3");
            INSERT INTO customers (id,first_name,last_name,gender,email,
              phone,national_id,comment_id,country_id) VALUES (
              "1","Alexander","Brown","1","alexanderbrown@mail.com<alexanderbrown@mail.com>","420305203","1234572",null,"6");
            COMMIT TRANSACTION;
            `;
            result = await this._SQLiteService.execute(sqlcmd);
            console.log("*** After Insert customers " + result.changes.changes);
            this.retEx3 = result.changes.changes === 2 ? true : false;
            if(this.retEx3) document.querySelector('.execute3-issue59').classList.remove('display');

            // Export to Json
            this.retExportFull = true;
            result = await this._SQLiteService.exportToJson("full");
            console.log('result fullexportToJson ',result);
            if (Object.keys(result.export).length === 0)  this.retExportFull = false;
            const jsObj: string = JSON.stringify(result.export);
            console.log("*** jsObject " + jsObj);
            result = await this._SQLiteService.isJsonValid(jsObj);
            if(!result.result) this.retExportFull = false;  
            if(this.retExportFull) document.querySelector('.export-issue59').classList.remove('display');
    

            // Close the Database
            result = await this._SQLiteService.close("test-json-db59");
            this.retClose = result.result

            if (this.retClose) document.querySelector('.close-issue59').classList.remove('display'); 
            console.log("$$$ End test-json-db59 test");
            console.log(`$$$ retEx2 ${this.retEx2} retEx3 ${this.retEx3} `+ 
            `retExportFull ${this.retExportFull} retClose ${this.retClose} $$$`)
        } else {
          console.log("*** Error: Create Tables Database test-json-db59 failed");
          resolve(false);
           
        }
      } else {
        console.log("*** Error: Database test-json-db59 not opened");
        resolve(false);
      }
    
      // test with Import
      console.log("$$$ Start Import a JSON Object");
      const dataToImport59: any = {
        database : "product-db",
        version : 1,
        encrypted : false,
        mode : "full",
        tables :[
          {
            "name": "countries",
            "schema": [
              { "column": "id", "value": "INTEGER PRIMARY KEY NOT NULL" },
              { "column": "name", "value": "TEXT NOT NULL" },
              { "column": "code", "value": "TEXT NOT NULL" },
              { "column": "language", "value": "TEXT NOT NULL" },
              { "column": "phone_code", "value": "TEXT" },
              { "column": "last_modified", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" }
            ],
            indexes: [
              {name: "index_country_on_name",column: "name"},
              {name: "index_country_on_last_modified",column: "last_modified"}
            ],
            values: [
                [3,"Afghanistan","AF","fa","93",1608216034],
                [6,"Albania","AL","sq","355",1608216034],
                [56,"Algeria","DZ","ar","213",1608216034],
            ]

          }
        ]
      };
      result = await this._SQLiteService
                .importFromJson(JSON.stringify(dataToImport59));    
      console.log('import result ',result)
      this.retImport = result.changes.changes >0 ? true : false;
      if(this.retImport) document.querySelector('.import-issue59').classList.remove('display');
      console.log("$$$ Start export to a JSON Object");

      // Export to Json
      this.retExport1Full = true;
      result = await this._SQLiteService.exportToJson("full");
      console.log('result fullexport1ToJson ',result);
      if (Object.keys(result.export).length === 0)  this.retExport1Full = false;
      const jsObj1: string = JSON.stringify(result.export);
      console.log("*** jsObject " + jsObj1);
      result = await this._SQLiteService.isJsonValid(jsObj1);
      if(!result.result) this.retExport1Full = false;  
      if(this.retExport1Full) document.querySelector('.export1-issue59').classList.remove('display');
      // Close the Database
      result = await this._SQLiteService.close("product-db");
      this.retClose1 = result.result

      if (this.retClose1) document.querySelector('.close1-issue59').classList.remove('display'); 
      console.log(`$$$ retImport ${this.retImport} `+ 
      `retExport1Full ${this.retExport1Full} retClose1 ${this.retClose1} $$$`)

      console.log("$$$ End export to a JSON Object");
      
      let ret = false;
      if(this.retEx2 && this.retEx3 && this.retClose && this.retExportFull &&
        this.retImport && this.retExport1Full && this.retClose1) ret = true;
      console.log(`$$$ before ending test issue#59 '${ret}'`);
      resolve(ret);
    });
  }

}
