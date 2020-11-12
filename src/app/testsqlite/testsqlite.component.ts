import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { Images } from '../utils/base64images';
//import { ReadImageService } from '../services/read-images.service';

@Component({
  selector: 'app-testsqlite',
  templateUrl: './testsqlite.component.html',
  styleUrls: ['./testsqlite.component.scss'],
})
export class TestsqliteComponent implements AfterViewInit {
  platform: string;
  noEncryption: boolean = false;
  updVersion: boolean = false;
  import: boolean = false;
  exportFull: boolean = false;
  exportPartial: boolean = false;
  executeSet: boolean = false;
  importFullIssue: boolean = false;
  encryption: boolean = false;
  encrypted: boolean = false; 
  wrongSecret: boolean = false;
  changeSecret: boolean = false;
  newSecret: boolean = false;    
  initTest:boolean = false;
  initPlugin: boolean = false;

  constructor(private _SQLiteService: SQLiteService) { }
  /*******************************
   * Component Lifecycle Methods *
   *******************************/

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    this.initPlugin = this._SQLiteService.initializePlugin();
    console.log(`in ngAfterViewInit this.initPlugin: ${this.initPlugin}`);
    console.log(`isService ${this._SQLiteService.isService}`);
  }
  ngOnDestroy() {
    console.log("ngOnDestroy");
    this._SQLiteService.handlerPermissions.remove();
  }
  /*******************************
  * Component Methods           *
  *******************************/

  async runTests(): Promise<void> {
    console.log("****** entering run tests");
    // In case of multiple test runs
    this.resetDOM();
    // Start Running the Set of Tests
    const cardSQLite = document.querySelector('.card-sqlite');
    if(cardSQLite && cardSQLite.classList.contains("hidden")) 
              cardSQLite.classList.remove('hidden');
    if(this.initPlugin) {
      this.initTest = await this.testInitialization();
      if (this.initTest) {
        // Create a Database with No-Encryption
        this.noEncryption = await this.testNoEncryption();
        if(!this.noEncryption) {     
          document.querySelector('.sql-failure1').classList
                  .remove('display');
        } else {
          console.log("***** End testDatabase *****");
          document.querySelector('.sql-success1').classList
                  .remove('display');
        }

        if(this.noEncryption) {
          // Test update database version
          this.updVersion = await this.testUpdateVersion();
          if(!this.updVersion) {
            document.querySelector('.sql-failure-version').classList
                .remove('display');
          } else {
            console.log("***** End Update Version *****");
            document.querySelector('.sql-success-version').classList
                .remove('display');  
          }
 
          // Create a Database from JSON import
          this.import = await this.testImportFromJson();
          if(!this.import) {
            document.querySelector('.sql-failure-json').classList.remove('display');
          } else {
            console.log("***** End Import From JSon *****");
            document.querySelector('.sql-success-json').classList.remove('display');  
          }
          // Full Export a database to JSON Object
          this.exportFull = await this.testFullExportToJson();
          if(!this.exportFull) {
            document.querySelector('.sql-failure-fullexport-json').classList.remove('display');
          } else {
            console.log("***** End Full Export to JSon *****");
            document.querySelector('.sql-success-fullexport-json').classList.remove('display');  
          }
          // Partial Export a database to JSON Object
          this.exportPartial = await this.testPartialExportToJson();
          if(!this.exportPartial) {
            document.querySelector('.sql-failure-partialexport-json').classList.remove('display');
          } else {
            console.log("***** End Partial Export to JSon *****");
            document.querySelector('.sql-success-partialexport-json').classList.remove('display');  
          }
          // Create a database from import schemas in one import and data in another import
          this.importFullIssue = await this.testTwoImports();
          if(!this.importFullIssue) {
            document.querySelector('.sql-failure-two-imports-schema-data').classList.remove('display');
          } else {
            console.log("***** End Two Imports Schema/Data  From Json *****");
            document.querySelector('.sql-success-two-imports-schema-data').classList.remove('display');  
          }
          
          // Create a database and test executeSet
          this.executeSet = await this.testExecuteSet();
          if(!this.executeSet) {
            document.querySelector('.sql-failure-test-executeset').classList.remove('display');
          } else {
            console.log("***** End Test Execute Set *****");
            document.querySelector('.sql-success-test-executeset').classList.remove('display');  
          }        
        }
        if(this.noEncryption && this.updVersion && this.import && 
            this.exportFull && this.exportPartial && 
            this.importFullIssue && this.executeSet &&
            this._SQLiteService.platform !== "electron") {
          // Encrypt the Non Encrypted Database
          this.encryption = await this.testEncryptionDatabase();
          if(!this.encryption) {
            document.querySelector('.sql-failure2').classList
                    .remove('display');
          } else {
            document.querySelector('.sql-success2').classList
                    .remove('display');
          }
          // Create a Database Encrypted
          this.encrypted = await this.testEncryptedDatabase();
          if(!this.encrypted) {
            document.querySelector('.sql-failure3').classList.remove('display');
          } else {
            document.querySelector('.sql-success3').classList.remove('display');

            // Try opening an Encrypted Database with wrong secet
            this.wrongSecret = await this.testWrongSecret();
            if (!this.wrongSecret) {
              document.querySelector('.sql-failure4').classList.remove('display');
            } else {
              document.querySelector('.sql-success4').classList.remove('display');
            } 
            // Giving a New Secret to an Encrypted  Database 
            this.changeSecret = await this.testChangePassword();
            if(!this.changeSecret) {
              document.querySelector('.sql-failure5').classList.remove('display');
            } else {
              document.querySelector('.sql-success5').classList.remove('display');

            // Open the Encrypted Database with the new secret
            this.newSecret = await this.testDatabaseNewPassword();
              if(!this.newSecret) {
                document.querySelector('.sql-failure6').classList.remove('display');
              } else {
                document.querySelector('.sql-success6').classList.remove('display');
              }

            }
          }
        }

      }
      // Manage All Tests Success/Failure
      if(this._SQLiteService.platform === 'electron') {
        if (!this.initTest || !this.noEncryption || !this.updVersion ||
            !this.import || !this.exportFull || !this.exportPartial ||
            !this.importFullIssue || !this.executeSet) {
          document.querySelector('.sql-allfailure').classList
              .remove('display');
        } else {
          document.querySelector('.sql-allsuccess').classList
              .remove('display');
        }
      } else {
        if(!this.initTest || !this.noEncryption || !this.encryption ||
          !this.encrypted || !this.wrongSecret || !this.changeSecret ||
          !this.newSecret || !this.import || !this.exportFull ||
          !this.exportPartial || !this.importFullIssue ||
          !this.executeSet || !this.updVersion) {     
          document.querySelector('.sql-allfailure').classList
              .remove('display');
        } else {
          document.querySelector('.sql-allsuccess').classList
              .remove('display');
        }
      }
    } else {
      this.platform = this._SQLiteService.platform.charAt(0)
          .toUpperCase() + this._SQLiteService.platform.slice(1);
      if(this._SQLiteService.platform === "web") {
        console.log(`CapacitorSQLite Plugin: Not available for ${this.platform} Platform`);
        document.querySelector('.web').classList.remove('display');
      } else {
        console.log('CapacitorSQLite Plugin: Initialization Failed');
        document.querySelector('.sql-allfailure').classList.remove('display');
      }
    }
  }
  /**
  * Reset the DOM
  */
  async resetDOM(): Promise<void> {
    const cardSQLite = document.querySelector('.card-sqlite');
    if(cardSQLite) {
      if (!cardSQLite.classList.contains("hidden")) cardSQLite.classList.add('hidden');
      for (let i:number=0;i< cardSQLite.childElementCount;i++) {
        if(!cardSQLite.children[i].classList.contains('display')) cardSQLite.children[i].classList.add('display');
      }
    }
  }

  /**
   * 
   */
  async testInitialization(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const echo = await this._SQLiteService.getEcho("Hello from JEEP");
      console.log("*** echo ",echo);
      resolve(true);
      // delete databases to enable test restart
      // as after the first pass the database is encrypted
      if(this._SQLiteService.platform === "ios" || this._SQLiteService.platform === "android" 
          || this._SQLiteService.platform === "electron") {
        // check if the database test-sqlite exists 
        let result: any = await this._SQLiteService.isDBExists("test-sqlite");
        console.log("isDBExists 'test-sqlite' " + JSON.stringify(result));
        console.log("*** ") 
        if(result.result) {
          // open the DB
          let resOpen = await this._SQLiteService.openDB("test-sqlite",true,"secret"); 
          if(resOpen.result) {
            let resDel: any = await this._SQLiteService.deleteDB("test-sqlite");
            if(!resDel.result) {
              console.log("Error in deleting the database test-sqlite");
              resolve(false);
            }
          } else {
            console.log("Error database test-sqlite does not exist");
            resolve(false);
          }
        }
        // check if the database test-executeset exists 
        result = await this._SQLiteService.isDBExists("test-executeset"); 
        if(result.result) {
          // open the DB
          let resOpen = await this._SQLiteService.openDB("test-executeset"); 
          if(resOpen.result) {
            let resDel: any = await this._SQLiteService.deleteDB("test-executeset");
            if(!resDel.result) {
              console.log("Error in deleting the database test-executeset");
              resolve(false);
            }
          } else {
            console.log("Error database test-executeset does not exist");
            resolve(false);
          }
        }
        // check if the database test-updversion exists 
        result = await this._SQLiteService.isDBExists("test-updversion"); 
        if(result.result) {
          // open the DB
          let resOpen = await this._SQLiteService.openDB("test-updversion"); 
          if(resOpen.result) {
            let resDel: any = await this._SQLiteService.deleteDB("test-updversion");
            if(!resDel.result) {
              console.log("Error in deleting the database test-updversion");
              resolve(false);
            }
          } else {
            console.log("Error database test-updversion does not exist");
            resolve(false);
          }
        }

        if (this._SQLiteService.platform != "electron") {
          // check if the database test-encrypted exists 
          result = await this._SQLiteService.isDBExists("test-encrypted");
          if(result.result) {
            // open the DB
            let resOpen = await this._SQLiteService.openDB("test-encrypted",true,"secret"); 
            if(resOpen.result) {
              let resDel: any = await this._SQLiteService.deleteDB("test-encrypted"); 
              if(!resDel) {
                console.log("Error in deleting the database test-encrypted");
                resolve(false);
              }
            } else {
              console.log("Error database test-encrypted does not exist");
              resolve(false);  
            }
          }
        }
      }
    });
  }
  /**
  * Test a non-encrypted database
  */
  async testNoEncryption(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // open the database
      let result:any = await this._SQLiteService.openDB("test-sqlite"); 
      if(result.result) {
        console.log("*** Database test-sqlite Opened");
        document.querySelector('.openDB').classList.remove('display');
        result = await this._SQLiteService.createSyncTable();

        // create tables
        const sqlcmd: string = `
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY NOT NULL,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            company TEXT,
            size FLOAT,
            age INTEGER,
            last_modified INTEGER DEFAULT (strftime('%s', 'now'))
        );
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY NOT NULL,
            userid INTEGER,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            last_modified INTEGER DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (userid) REFERENCES users(id) ON DELETE SET DEFAULT
        );
        CREATE TABLE IF NOT EXISTS images (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT UNIQUE NOT NULL,
          type TEXT NOT NULL,
          size INTEGER,
          img BLOB,
          last_modified INTEGER DEFAULT (strftime('%s', 'now'))
        );
        CREATE INDEX IF NOT EXISTS users_index_name ON users (name);
        CREATE INDEX IF NOT EXISTS users_index_last_modified ON users (last_modified);
        CREATE INDEX IF NOT EXISTS messages_index_name ON messages (title);
        CREATE INDEX IF NOT EXISTS messages_index_last_modified ON messages (last_modified);
        CREATE INDEX IF NOT EXISTS images_index_name ON images (name);
        CREATE INDEX IF NOT EXISTS images_index_last_modified ON images (last_modified);
        CREATE TRIGGER IF NOT EXISTS users_trigger_last_modified
        AFTER UPDATE ON users
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE users SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
        END;
        CREATE TRIGGER IF NOT EXISTS messages_trigger_last_modified
        AFTER UPDATE ON messages
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE messages SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
        END;
        CREATE TRIGGER IF NOT EXISTS images_trigger_last_modified
        AFTER UPDATE ON images
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE images SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
        END;
        PRAGMA user_version = 1;
        COMMIT TRANSACTION;
        `;
        result = await this._SQLiteService.execute(sqlcmd);
        if(result.changes.changes === 0 || result.changes.changes === 1) {
            document.querySelector('.execute1').classList.remove('display'); 
            // Insert some Users
            const row: Array<Array<any>> = [["Whiteley","Whiteley.com",30],["Jones","Jones.com",44]];
            let sqlcmd: string = `
            BEGIN TRANSACTION;
            DELETE FROM users;
            INSERT INTO users (name,email,age) VALUES ("${row[0][0]}","${row[0][1]}",${row[0][2]});
            INSERT INTO users (name,email,age) VALUES ("${row[1][0]}","${row[1][1]}",${row[1][2]});
            COMMIT TRANSACTION;
            `;
            result = await this._SQLiteService.execute(sqlcmd);
            const retEx2 = result.changes.changes === 2 ? true : false;
            if(retEx2) document.querySelector('.execute2').classList.remove('display'); 

            // Select all Users
            sqlcmd = "SELECT * FROM users;";
            result = await this._SQLiteService.query(sqlcmd);
            const retQuery1 = result.values.length === 2 &&
            result.values[0].name === "Whiteley" && result.values[1].name === "Jones" ? true : false;
            if(retQuery1) document.querySelector('.query1').classList.remove('display'); 
        if(!retQuery1) console.log('Select all users not successful')
        sqlcmd = "SELECT * FROM users WHERE company IS NULL;";
        result = await this._SQLiteService.query(sqlcmd);
        const retQuery20 = result.values.length === 2 &&
        result.values[0].name === "Whiteley" && result.values[1].name === "Jones" ? true : false;
        if(!retQuery20) console.log('Select all users company is null not successful')
        sqlcmd = "SELECT * FROM users WHERE size IS NULL;";
        result = await this._SQLiteService.query(sqlcmd);
        const retQuery21 = result.values.length === 2 &&
        result.values[0].name === "Whiteley" && result.values[1].name === "Jones" ? true : false;
        if(!retQuery21) console.log('Select all users size is null not successful')
        sqlcmd = `
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS temp (
            temp_id INTEGER PRIMARY KEY NOT NULL,
            temp_email TEXT UNIQUE NOT NULL,
            temp_name TEXT,
            temp_company TEXT,
            temp_size FLOAT,
            temp_age INTEGER
        );
        COMMIT TRANSACTION;
        `;
        result = await this._SQLiteService.execute(sqlcmd);
        const retExe21 = result.changes.changes === 0 || result.changes.changes === 1 ? true : false;
        if(!retExe21) console.log('Create table  temp not successful')
        sqlcmd = `INSERT INTO temp
        (temp_id, temp_email, temp_name, temp_size, temp_company, temp_age)
        SELECT id, email, name, size, company, age
        FROM users
        WHERE company IS NULL;`;
        result = await this._SQLiteService.run(sqlcmd);
        console.log("result insert temp ", result)
        const retRun21 = result.changes.changes === 2 &&
        result.changes.lastId === 2 ? true : false;
        if(!retRun21) console.log('Insert into temp not successful')
        sqlcmd = "SELECT * FROM temp;";
        result = await this._SQLiteService.query(sqlcmd);
        const retQuery22 = result.values.length === 2 &&
        result.values[0].temp_name === "Whiteley" && result.values[1].temp_name === "Jones" ? true : false;
        if(!retQuery22) console.log('Select all users 1 from temp not successful')
        sqlcmd = "INSERT INTO temp (temp_name,temp_email) VALUES (?,?)";
        let values1: Array<any>  = ["Simpson","Simpson@example.com"];
        result = await this._SQLiteService.run(sqlcmd,values1);
        const retRun22 = result.changes.changes === 1 &&
                        result.changes.lastId === 3 ? true : false;
        if(!retRun22) console.log('Insert new users to temp not successful')
        sqlcmd = "SELECT * FROM temp;";
        result = await this._SQLiteService.query(sqlcmd);
        const retQuery23 = result.values.length === 3 &&
        result.values[2].temp_name === "Simpson" && result.values[2].temp_email === "Simpson@example.com" ? true : false;
        if(!retQuery23) console.log('Select all users 2 from temp not successful')
            // add one user with statement and values              
            sqlcmd = "INSERT INTO users (name,email,age) VALUES (?,?,?)";
            let values: Array<any>  = ["Simpson","Simpson@example.com",69];
            result = await this._SQLiteService.run(sqlcmd,values);
            const retRun1 = result.changes.changes === 1 &&
                            result.changes.lastId === 3 ? true : false;
            console.log("**** result.changes.lastId ",result.changes.lastId);
            if(retRun1) document.querySelector('.run1').classList.remove('display');        

            // add one user with statement              
            sqlcmd = `INSERT INTO users (name,email,age) VALUES ("Brown","Brown@example.com",15)`;
            result = await this._SQLiteService.run(sqlcmd);
            const retRun2 = result.changes.changes === 1 &&
                            result.changes.lastId === 4 ? true : false;
            if(retRun2) document.querySelector('.run2').classList.remove('display');

            // Select all Users
            sqlcmd = "SELECT * FROM users";
            result = await this._SQLiteService.query(sqlcmd);
            const retQuery3 = result.values.length === 4 ? true : false;
            if(retQuery3) document.querySelector('.query3').classList.remove('display'); 

            // Select Users with age > 35
            sqlcmd = "SELECT name,email,age FROM users WHERE age > ?";
            values = ["35"];
            result = await this._SQLiteService.query(sqlcmd,values);
            const retQuery4 = result.values.length === 2 ? true : false;
            if(retQuery4) document.querySelector('.query4').classList.remove('display'); 

            // Insert some Messages
            sqlcmd = `
            BEGIN TRANSACTION;
            DELETE FROM messages;
            INSERT INTO messages (userid,title,body) VALUES (1,"test post 1","content test post 1");
            INSERT INTO messages (userid,title,body) VALUES (2,"test post 2","content test post 2");
            INSERT INTO messages (userid,title,body) VALUES (1,"test post 3","content test post 3");
            COMMIT TRANSACTION;
            `;
            result = await this._SQLiteService.execute(sqlcmd);
            const retEx3 = result.changes.changes === 3 ? true : false;
            if(retEx3) document.querySelector('.execute3').classList.remove('display'); 

            // Select all Messages
            sqlcmd = "SELECT * FROM messages";
            result = await this._SQLiteService.query(sqlcmd);
            const retQuery2 = result.values.length === 3 &&
                      result.values[0].title === "test post 1" && result.values[1].title === "test post 2"
                        && result.values[2].title === "test post 3" ? true : false;
            if(retQuery2) document.querySelector('.query2').classList.remove('display'); 

            // insert some Images
            sqlcmd = "INSERT INTO images (name,type,img) VALUES (?,?,?)";
            let imgvalues: Array<any>  = ["meowth","png",Images[0]];
            result = await this._SQLiteService.run(sqlcmd,imgvalues);
            const retRun3 = result.changes.changes === 1 ? true : false;
            if(retRun3) document.querySelector('.run3').classList.remove('display');        
            sqlcmd = "INSERT INTO images (name,type,img) VALUES (?,?,?)";
            imgvalues = ["feather","png",Images[1]];
            result = await this._SQLiteService.run(sqlcmd,imgvalues);
            const retRun4 = result.changes.changes === 1 ? true : false;
            if(retRun4) document.querySelector('.run4').classList.remove('display');        
            // Select all Imagess
            sqlcmd = "SELECT * FROM images";
            result = await this._SQLiteService.query(sqlcmd);
            const retQuery5 = result.values.length === 2 &&
                      result.values[0].name === "meowth" && result.values[1].type === "png" ? true : false;
            if(retQuery5) document.querySelector('.query5').classList.remove('display');        
             
            // Close the Database
            result = await this._SQLiteService.close("test-sqlite");
            const retClose = result.result

            if (retClose) document.querySelector('.close').classList.remove('display'); 
            let ret = false;
            if(retEx2 && retQuery1 && retRun1 && retRun2 && retQuery3 && retQuery4 &&
              retEx3 && retQuery2  && retRun3 && retRun4 && retClose && retQuery5) ret = true;
            resolve(ret);
          
        } else {
          resolve(false);
        }
      } else {
        console.log("*** Error: Database test-sqlite not opened");
        resolve(false);
      }
 
    });
  }
//1234567890123456789012345678901234567890123456789012345678901234567890
  /**
  * Test Update Version
  */
 async testUpdateVersion():Promise<boolean> {
  return new Promise(async (resolve) => {
    let ret:boolean = true;
    console.log("*** Starting testUpdateVersion ***")

    // Create Database Version 1

    // open the database
    let result:any = await this._SQLiteService.openDB("test-updversion");
    console.log('openDB result.result ' + result.result); 
    if(result.result) {
      console.log("*** Database test-updversion Opened");
      document.querySelector('.openDB').classList.remove('display');

      result = await this._SQLiteService.createSyncTable();
      console.log('createSyncTable result ' + result); 

      // create tables
      const sqlcmd: string = `
      BEGIN TRANSACTION;
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY NOT NULL,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          company TEXT,
          size FLOAT,
          age INTEGER,
          last_modified INTEGER DEFAULT (strftime('%s', 'now'))    
      );
      CREATE INDEX IF NOT EXISTS users_index_name ON users (name);
      CREATE INDEX IF NOT EXISTS users_index_last_modified ON users (last_modified);
      CREATE TRIGGER IF NOT EXISTS users_trigger_last_modified
      AFTER UPDATE ON users
      FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
      BEGIN
          UPDATE users SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
      END;
      COMMIT TRANSACTION;
      `;
      result = await this._SQLiteService.execute(sqlcmd);
      if(result.changes.changes === 0 || result.changes.changes === 1) {
          document.querySelector('.execute1').classList.remove('display'); 
          // Insert some Users
          const row: Array<Array<any>> = [["Whiteley","Whiteley.com",30],["Jones","Jones.com",44]];
          let sqlcmd: string = `
          BEGIN TRANSACTION;
          DELETE FROM users;
          INSERT INTO users (name,email,age) VALUES ("${row[0][0]}","${row[0][1]}",${row[0][2]});
          INSERT INTO users (name,email,age) VALUES ("${row[1][0]}","${row[1][1]}",${row[1][2]});
          COMMIT TRANSACTION;
          `;
          result = await this._SQLiteService.execute(sqlcmd);
          const retEx2 = result.changes.changes === 2 ? true : false;
          if(retEx2) document.querySelector('.execute2').classList.remove('display'); 

          // Select all Users
          sqlcmd = "SELECT * FROM users;";
          result = await this._SQLiteService.query(sqlcmd);
          const retQuery1 = result.values.length === 2 &&
          result.values[0].name === "Whiteley" && result.values[1].name === "Jones" ? true : false;
          if(retQuery1) document.querySelector('.query1').classList.remove('display'); 
          if(!retQuery1) console.log('Select all users not successful')
          sqlcmd = "SELECT * FROM users WHERE company IS NULL;";
          result = await this._SQLiteService.query(sqlcmd);
          const retQuery20 = result.values.length === 2 &&
          result.values[0].name === "Whiteley" && result.values[1].name === "Jones" ? true : false;
          if(!retQuery20) console.log('Select all users company is null not successful')
          sqlcmd = "SELECT * FROM users WHERE size IS NULL;";
          result = await this._SQLiteService.query(sqlcmd);
          const retQuery21 = result.values.length === 2 &&
          result.values[0].name === "Whiteley" && result.values[1].name === "Jones" ? true : false;
          if(!retQuery21) console.log('Select all users size is null not successful')
          // Close the Database
          result = await this._SQLiteService.close("test-updversion");
          const retClose = result.result

          if (retClose) document.querySelector('.close').classList.remove('display'); 
          if(!retEx2 || !retQuery1) resolve(false);
      } else {
        resolve(false);
      }
    } else {
      console.log("*** Error: Database test-updversion not opened");
      resolve(false);
    }

    // Create Database Version 2
    const schemaStmt: string = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY NOT NULL,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      company TEXT,
      country TEXT,
      age INTEGER,
      last_modified INTEGER DEFAULT (strftime('%s', 'now'))       
    );
    CREATE TABLE messages (
      id INTEGER PRIMARY KEY NOT NULL,
      userid INTEGER,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      last_modified INTEGER DEFAULT (strftime('%s', 'now')),        
      FOREIGN KEY (userid) REFERENCES users(id) ON DELETE SET DEFAULT
    );
    CREATE INDEX users_index_name ON users (name);
    CREATE INDEX users_index_last_modified ON users (last_modified);
    CREATE INDEX messages_index_title ON messages (title);
    CREATE INDEX messages_index_last_modified ON messages (last_modified);
    CREATE TRIGGER users_trigger_last_modified
    AFTER UPDATE ON users
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
    BEGIN
        UPDATE users SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
    END;
    CREATE TRIGGER messages_trigger_last_modified
    AFTER UPDATE ON messages
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
    BEGIN
        UPDATE messages SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
    END;
    `
    const setArray: Array<any> = [
      { statement:"INSERT INTO messages (userid,title,body) VALUES (?,?,?);",
        values:[1,"test message 1","content test message 1"]
      },
      { statement:"INSERT INTO messages (userid,title,body) VALUES (?,?,?);",
        values:[2,"test message 2","content test message 2"]
      },
      { statement:"INSERT INTO messages (userid,title,body) VALUES (?,?,?);",
        values:[1,"test message 3","content test message 3"]
      },
      { statement:"UPDATE users SET country = ?  WHERE id = ?;",
        values:["United Kingdom",1]
      },
      { statement:"UPDATE users SET country = ?  WHERE id = ?;",
        values:["Australia",2]
      },

    ]
    
    result = await this._SQLiteService.addUpgradeStatement("test-updversion",
    {fromVersion: 1, toVersion: 2, statement: schemaStmt, set: setArray});     
    console.log("*** addUpgradeStatement result " + result + " ***")
    if(!result.result) {
      console.log("*** Error: addUpgradeStatement failed");
      resolve(false);
    }
    // open the database
    result = await this._SQLiteService.openDB("test-updversion",false,"no-encryption",2);
    console.log('openDB version 2 result.result ' + result.result); 
    if(!result.result) {
      console.log("*** Database test-updversion failed opening version 2");
      resolve(false);
    } else {
      console.log("*** Database test-updversion Opened");
      resolve(true);
    }
  });
}
  /**
  * Test an ImportFromJson
  */
  async testImportFromJson():Promise<boolean> {
    return new Promise(async (resolve) => {
      let ret:boolean = true;
      const dataToImport: any = {
        database : "db-from-json",
        version : 1,
        encrypted : false,
        mode : "full",
        tables :[
            {
                name: "users",
                schema: [
                    {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
                    {column:"email", value:"TEXT UNIQUE NOT NULL"},
                    {column:"name", value:"TEXT"},
                    {column:"age", value:"INTEGER"},
                    {column:"last_modified", value:"INTEGER"}
                ],
                indexes: [
                    {name: "index_user_on_name",column: "name"},
                    {name: "index_user_on_last_modified",column: "last_modified"}
                ],
                values: [
                    [1,"Whiteley.com","Whiteley",30,1582536810],
                    [2,"Jones.com","Jones",44,1582812800],
                    [3,"Simpson@example.com","Simpson",69,1583570630],
                    [4,"Brown@example.com","Brown",15,1590383895]
                ]
            },
            {
              name: "messages",
              schema: [
                {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
                {column:"title", value:"TEXT NOT NULL"},
                {column:"body", value:"TEXT NOT NULL"},
                {column:"last_modified", value:"INTEGER"}
              ],
              values: [
                  [1,"test post 1","content test post 1",1587310030],
                  [2,"test post 2","content test post 2",1590388125]
              ]
            },
            {
              name: "images",
              schema: [
                {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
                {column:"name", value:"TEXT UNIQUE NOT NULL"},
                {column:"type", value:"TEXT NOT NULL"},
                {column:"size", value:"INTEGER"},
                {column:"img", value:"BLOB"},
                {column:"last_modified", value:"INTEGER"}
              ],
              values: [
                [1,"feather","png","NULL",Images[1],1582536810],
                [2,"meowth","png","NULL",Images[0],1590151132]
              ]
            }
    
        ]
      };
     
      let result:any = await this._SQLiteService.importFromJson(JSON.stringify(dataToImport));    
      console.log('import result ',result)
      if(result.changes.changes === -1 ) ret = false;
      if(ret) {
        const partialImport1: any = {
          database : "db-from-json",
          version : 1,
          encrypted : false,
          mode : "partial",
          tables :[
              {
                  name: "users",
                  values: [
                      [5,"Addington.com","Addington",22,1590388335],
                      [6,"Bannister.com","Bannister",59,1590393015],
                      [2,"Jones@example.com","Jones",45,1590393325]

                  ]
              },
              {
                name: "messages",
                indexes: [
                  {name: "index_messages_on_title",column: "title"},
                  {name: "index_messages_on_last_modified",column: "last_modified"}

                ],
                values: [
                    [3,"test post 3","content test post 3",1590396146],
                    [4,"test post 4","content test post 4",1590396288]
                ]
              }
      
          ]
        }; 
        let result:any = await this._SQLiteService.importFromJson(JSON.stringify(partialImport1));
        if(result.changes.changes === -1 ) ret = false;
      }
      if(ret) {
        // create the async table
        result = await this._SQLiteService.openDB("db-from-json"); 
        if(result.result) {
          result = await this._SQLiteService.createSyncTable();
        }
      } else {
          console.log("importFromJson: Error " + result.message);
      }
      resolve(ret);
    });
  }

  /**
  * Test a full export to Json
  */
  async testFullExportToJson():Promise<boolean> {
    return new Promise(async (resolve) => {
      // open the database
      let result:any = await this._SQLiteService.openDB("db-from-json"); 
      if(result.result) {
        let ret:boolean = true;
        let result:any = await this._SQLiteService.exportToJson("full");
        console.log('result fullexportToJson ',result);
        if (Object.keys(result.export).length === 0)  ret = false;
        const jsObj: string = JSON.stringify(result.export); 
        result = await this._SQLiteService.isJsonValid(jsObj);
        if(!result.result) ret = false;  
        resolve(ret);
      } else {
        console.log("*** Error: Database db-from-json not opened");
        resolve(false);
      }
    });
  }

  /**
  * Test a partial export to Json
  */
  async testPartialExportToJson():Promise<boolean> {
    return new Promise(async (resolve) => {
      // open the database
      let result:any = await this._SQLiteService.openDB("db-from-json"); 
      if(result.result) {
        let ret:boolean = true;
        const syncDate: string = "2020-03-27T08:30:25.000Z";
        ret = await this._SQLiteService.setSyncDate(syncDate);
        if(ret) {
          let result:any = await this._SQLiteService.exportToJson("partial");
          console.log('result partialexportToJson ',result);
          if (Object.keys(result.export).length === 0)  ret = false;
          const jsObj: string = JSON.stringify(result.export); 
          result = await this._SQLiteService.isJsonValid(jsObj);
          if(!result.result) ret = false;  
        }     
        resolve(ret);
      } else {
        console.log("*** Error: Database db-from-json not opened");
        resolve(false);
      }

    });
  }
  /**
  * Test executeSet method
  */
  async testExecuteSet(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // open the database
      let result:any = await this._SQLiteService.openDB("test-executeset"); 
      if(result.result) {

        result = await this._SQLiteService.createSyncTable();
        console.log('****** create db ******');
        // create tables
        let sqlcmd: string = `
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY NOT NULL,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          FirstName TEXT,
          company TEXT,
          size REAL,
          age INTEGER,
          MobileNumber TEXT
        );
        CREATE INDEX IF NOT EXISTS users_index_name ON users (name);
        CREATE INDEX IF NOT EXISTS users_index_email ON users (email);
        PRAGMA user_version = 1;
        PRAGMA foreign_keys = ON;
        COMMIT TRANSACTION;
        `;
        result = await this._SQLiteService.execute(sqlcmd);
        if(result.changes.changes == -1) resolve(false);
        let set: Array<any>  = [
          { statement:"INSERT INTO users (name,FirstName,email,age,MobileNumber) VALUES (?,?,?,?,?);",
            values:["Simpson","Tom","Simpson@example.com",69,"4405060708"]
          },
          { statement:"INSERT INTO users (name,FirstName,email,age,MobileNumber) VALUES (?,?,?,?,?);",
            values:["Jones","David","Jones@example.com",42,"4404030201"]
          },
          { statement:"INSERT INTO users (name,FirstName,email,age,MobileNumber) VALUES (?,?,?,?,?);",
            values:["Whiteley","Dave","Whiteley@example.com",45,"4405162732"]
          },
          { statement:"INSERT INTO users (name,FirstName,email,age,MobileNumber) VALUES (?,?,?,?,?);",
            values:["Brown","John","Brown@example.com",35,"4405243853"]
          },
          { statement:"UPDATE users SET age = ? , MobileNumber = ? WHERE id = ?;",
            values:[51,"4404030202",2]
          }
        ];
        result = await this._SQLiteService.executeSet(set);
        console.log("result.changes.changes ",result.changes.changes)
        if(result.changes.changes != 5) resolve(false);
        resolve(true);
      } else {
        resolve(false);
      } 
    });
  }
  /**
  * Test Two imports Schema/Data
  */
  async testTwoImports(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const tableImport: any = {
        database: "twoimports",
        version : 1,
        encrypted: false,
        mode: "full",
        tables: [
          {
            name: "areas",
            schema: [
              { column: "id", value: "INTEGER PRIMARY KEY NOT NULL" },
              { column: "name", value: "TEXT" },
              { column: "favourite", value: "INTEGER" },
              { column:"last_modified", value:"INTEGER"},
            ],
          },
          {
            name: "elements",
            schema: [
              { column: "id", value: "INTEGER PRIMARY KEY NOT NULL" },
              { column: "name", value: "TEXT" },
              { column: "favourite", value: "INTEGER" },
              { column:"last_modified", value:"INTEGER"},
            ],
          },
          {
            name: "issues",
            schema: [
              { column: "id", value: "INTEGER PRIMARY KEY NOT NULL" },
              { column: "name", value: "TEXT" },
              { column: "favourite", value: "INTEGER" },
              { column:"last_modified", value:"INTEGER"},
            ],
          },
        ],
      }; 
    
      let result: any = await this._SQLiteService.importFromJson(JSON.stringify(tableImport));
      console.log('import result ', result)
     
      if(result.changes.changes === -1 ) resolve(false);
      // import the data
      const partialImport: any = {
        database: "twoimports",
        version : 1,
        encrypted: false,
        mode: "partial",
        tables: [
          {
            name: "areas",
            values: [
              [1, "Access road", 0, 1590396146],
              [2, "Accessway", 0, 1590396146],
              [3, "Air handling system", 0, 1590396146],
            ],

          },
          {
            name: "elements",
            values: [
              [1, "Access door < 3m in height", 0, 1590396288],
              [2, "Access door > 3m in height", 0, 1590396288],
              [3, "Air inflitration", 0, 1590396288],
              [4, "Air ventilation", 0, 1590396288],
            ],
          },
          {
            name: "issues",
            values: [
              [1, "Accumulation of internal moisture", 0, 1590388335],
              [2, "Backflow prevention device", 0, 1590388335],
              [3, "Backpressure", 0, 1590388335],
              [4, "Backsiphonage", 0, 1590388335],
            ],
          },
        ],
      };
      result = await this._SQLiteService.importFromJson(JSON.stringify(partialImport));
      console.log('import result ', result)
     
      if(result.changes.changes === -1 ) resolve(false);
     
      resolve(true);

    });
  }

  /**
  * Test an encrypted database
  */
  async testEncryptedDatabase(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // open the database
      let result:any = await this._SQLiteService.openDB("test-encrypted",true,"secret"); 
      if(result.result) {
        console.log("*** Database test-encrypted Opened");
        // Create Tables if not exist
        let sqlcmd: string = `
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY NOT NULL,
            email TEXT UNIQUE NOT NULL,
            name TEXT
        );
        PRAGMA user_version = 1;
        COMMIT TRANSACTION;
        `;
        result = await this._SQLiteService.execute(sqlcmd);
        const retEx1 = result.changes.changes === 0 || result.changes.changes === 1 ? true : false;
        if(retEx1) {
          // Insert some Contacts
          sqlcmd = `
          BEGIN TRANSACTION;
          DELETE FROM contacts;
          INSERT INTO contacts (name,email) VALUES ("Whiteley","Whiteley.com");
          INSERT INTO contacts (name,email) VALUES ("Jones","Jones.com");
          COMMIT TRANSACTION;
          `;
          result = await this._SQLiteService.execute(sqlcmd);
          const retEx2 = result.changes.changes === 2 ? true : false;
          // Select all Contacts
          sqlcmd = "SELECT * FROM contacts";
          result = await this._SQLiteService.query(sqlcmd);
          const retQuery1 = result.values.length === 2 && result.values[0].name === "Whiteley" 
            && result.values[1].name === "Jones" ? true : false;

          // Close the Database
          result = await this._SQLiteService.close("test-encrypted");
          const retClose = result.result;
          if(retEx2 && retQuery1 && retClose) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      } else {
          console.log("*** Error: Database test-encrypted not opened");
          resolve(false);
      }
    });
  }
  /**
  * Try opening an encrypted database with wrong secret
  */
  async testWrongSecret(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // open the database
      const result: any = await this._SQLiteService.openDB("test-encrypted",true,"wrongsecret"); 
      console.log("*** out of testWrongSecret result.result " + result.result)
      if(!result.result) {
        console.log("*** out of testWrongSecret true")
        resolve(true);
      } else {
        console.log("*** out of testWrongSecret false")
        resolve(false);
      }
    });
  }
  /**
  * Change the secret of an encrypted database
  */

  async testChangePassword(): Promise<boolean> {
    return new Promise(async (resolve,) => {
      // open the database
      let result:any = await this._SQLiteService.openDB("test-encrypted",true,"newsecret"); 
      if(result.result) {
        console.log("*** Database test-encrypted Opened");
        let sqlcmd: string = "SELECT * FROM contacts";
        result = await this._SQLiteService.query(sqlcmd);
        const retQuery1 = result.values.length === 2 && result.values[0].name === "Whiteley" 
        && result.values[1].name === "Jones" ? true : false;

        // Close the Database
        result = await this._SQLiteService.close("test-encrypted");
        const retClose = result.result;
        if(retQuery1 && retClose) {
          resolve(true);
        } else {
          resolve(false);
        }

      } else {
        console.log("*** Error: Database test-encrypted not opened");
        resolve(false);
      }
    });
  }
  /**
  * Open an encrypted database after having change the secret
  */

  async testDatabaseNewPassword(): Promise<boolean> {
    return new Promise(async (resolve) => {
      console.log("*** Entyering testDatabaseNewPassword ***");
      // open the database
      let result:any = await this._SQLiteService.openDB("test-encrypted",true,"secret"); 
      if(result.result) {
        console.log("*** Database test-encrypted Opened");
        let sqlcmd: string = "SELECT * FROM contacts";
        result = await this._SQLiteService.query(sqlcmd);
        const retQuery1 = result.values.length === 2 && result.values[0].name === "Whiteley" 
        && result.values[1].name === "Jones" ? true : false;

        // Close the Database
        result = await this._SQLiteService.close("test-encrypted");
        const retClose = result.result;
        if(retQuery1 && retClose) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        console.log("*** Error: Database test-encrypted not opened");
        resolve(false);
      }
    });
  }

  /**
  * Encrypt a Non-Encrypted Database
  */
  async testEncryptionDatabase(): Promise<boolean> {
    return new Promise(async(resolve) => {
      // open the database
      let result:any = await this._SQLiteService.openDB("test-sqlite",true,"encryption"); 
      if(result.result) {

        // Select all Users
        let sqlcmd:string = "SELECT * FROM users";
        result = await this._SQLiteService.query(sqlcmd);
        const retQuery1 = result.values.length === 4 &&
            result.values[0].name === "Whiteley" && result.values[1].name === "Jones" &&
            result.values[2].name === "Simpson" && result.values[3].name === "Brown"
            ? true : false;

        // Select all Messages
        sqlcmd = "SELECT * FROM messages";
        result = await this._SQLiteService.query(sqlcmd);
        const retQuery2 = result.values.length === 2 &&
            result.values[0].title === "test post 1" && result.values[1].title === "test post 2"
            ? true : false;
        
        // Close the Database
        result = await this._SQLiteService.close("test-sqlite");
        const retClose = result.result;
        if(retQuery1 && retClose) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        console.log("*** Error: Database test-sqlite not opened");
        resolve(false);
      }
    });
  }
}

/*



*/