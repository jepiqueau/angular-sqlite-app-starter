import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';

@Component({
  selector: 'app-testsqlite',
  templateUrl: './testsqlite.component.html',
  styleUrls: ['./testsqlite.component.scss'],
})
export class TestsqliteComponent implements AfterViewInit {
  platform: string;
  noEncryption: boolean = false;
  import: boolean = false;
  encryption: boolean = false;
  encrypted: boolean = false; 
  wrongSecret: boolean = false;
  changeSecret: boolean = false;
  newSecret: boolean = false;    
  initTest:boolean = false;

  constructor(private _SQLiteService: SQLiteService) { }
  /*******************************
   * Component Lifecycle Methods *
   *******************************/

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    await this._SQLiteService.initializePlugin();
  }

  /*******************************
  * Component Methods           *
  *******************************/

  async runTests(): Promise<void> {
    console.log("****** entering run tests")
    // In case of multiple test runs
    this.resetDOM();
    // Start Running the Set of Tests
    const cardSQLite = document.querySelector('.card-sqlite');
    if(cardSQLite && cardSQLite.classList.contains("hidden")) cardSQLite.classList.remove('hidden');
    console.log('this.sqliteService.isService ',this._SQLiteService.isService)
    if(this._SQLiteService.isService) {
      this.initTest = await this.testInitialization();
      if (this.initTest) {
        // Create a Database with No-Encryption
        this.noEncryption = await this.testNoEncryption();
        console.log('this.noEncryption this.import ',this.noEncryption,this.import)
        if(!this.noEncryption) {     
          document.querySelector('.sql-failure1').classList.remove('display');
        } else {
          console.log("***** End testDatabase *****")
          document.querySelector('.sql-success1').classList.remove('display');
        }
        if(this.noEncryption && this._SQLiteService.platform !== "ios") {
          // Create a Database from JSON import
          this.import = await this.testImportFromJson();
          if(!this.import) {
            document.querySelector('.sql-failure-json').classList.remove('display');
          } else {
            console.log("***** End Import From JSon *****")
            document.querySelector('.sql-success-json').classList.remove('display');  
          }
        }
        if(this.noEncryption && this.import && this._SQLiteService.platform !== "electron") {
          // Encrypt the Non Encrypted Database
          this.encryption = await this.testEncryptionDatabase();
          if(!this.encryption) {
            document.querySelector('.sql-failure2').classList.remove('display');
          } else {
            document.querySelector('.sql-success2').classList.remove('display');
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
        if (!this.initTest || !this.noEncryption || !this.import) {
          document.querySelector('.sql-allfailure').classList.remove('display');
        } else {
          document.querySelector('.sql-allsuccess').classList.remove('display');
        }
      } else {
        if(!this.initTest || !this.noEncryption || !this.encryption || !this.encrypted || 
        !this.wrongSecret || !this.changeSecret || !this.newSecret || !this.import) {     
          document.querySelector('.sql-allfailure').classList.remove('display');
        } else {
          document.querySelector('.sql-allsuccess').classList.remove('display');
        }
      }
    } else {
      this.platform = this._SQLiteService.platform.charAt(0).toUpperCase() + 
      this._SQLiteService.platform.slice(1);
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
      // delete databases to enable test restart
      // as after the first pass the database is encrypted
      if(this._SQLiteService.platform === "ios" || this._SQLiteService.platform === "android" 
          || this._SQLiteService.platform === "electron") {
        let result: any = await this._SQLiteService.deleteDB("test-sqlite"); 
        if (this._SQLiteService.platform != "electron") {
          result = await this._SQLiteService.deleteDB("test-encrypted");
        }
      }
      const echo = await this._SQLiteService.getEcho("Hello from JEEP");
      console.log("*** echo ",echo);
      resolve(true);
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
        console.log('result.result ',result.result)
        console.log("*** Database test-sqlite Opened");
        document.querySelector('.openDB').classList.remove('display');

        // create tables
        const sqlcmd: string = `
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY NOT NULL,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            age INTEGER
        );
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL
        );
        CREATE INDEX users_index_name ON users (name);
        PRAGMA user_version = 1;
        COMMIT TRANSACTION;
        `;
        result = await this._SQLiteService.execute(sqlcmd);

        if(result.changes === 0 || result.changes === 1) {
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
            const retEx2 = result.changes === 0 || result.changes === 1 ? true : false;
            if(retEx2) document.querySelector('.execute2').classList.remove('display'); 

            // Select all Users
            sqlcmd = "SELECT * FROM users";
            result = await this._SQLiteService.query(sqlcmd);
            const retQuery1 = result.values.length === 2 &&
            result.values[0].name === "Whiteley" && result.values[1].name === "Jones" ? true : false;
            if(retQuery1) document.querySelector('.query1').classList.remove('display'); 

            // add one user with statement and values              
            sqlcmd = "INSERT INTO users (name,email,age) VALUES (?,?,?)";
            let values: Array<any>  = ["Simpson","Simpson@example.com",69];
            result = await this._SQLiteService.run(sqlcmd,values);
            const retRun1 = result.changes === 1 ? true : false;
            if(retRun1) document.querySelector('.run1').classList.remove('display');        

            // add one user with statement              
            sqlcmd = `INSERT INTO users (name,email,age) VALUES ("Brown","Brown@example.com",15)`;
            result = await this._SQLiteService.run(sqlcmd);
            const retRun2 = result.changes === 1 ? true : false;
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
            console.log("*** result ",result)

            const retQuery4 = result.values.length === 2 ? true : false;
            if(retQuery4) document.querySelector('.query4').classList.remove('display'); 

            // Insert some Messages
            sqlcmd = `
            BEGIN TRANSACTION;
            DELETE FROM messages;
            INSERT INTO messages (title,body) VALUES ("test post 1","content test post 1");
            INSERT INTO messages (title,body) VALUES ("test post 2","content test post 2");
            COMMIT TRANSACTION;
            `;
            result = await this._SQLiteService.execute(sqlcmd);
            const retEx3 = result.changes === 0 || result.changes === 1 ? true : false;
            if(retEx3) document.querySelector('.execute3').classList.remove('display'); 

            // Select all Messages
            sqlcmd = "SELECT * FROM messages";
            result = await this._SQLiteService.query(sqlcmd);
            const retQuery2 = result.values.length === 2 &&
                      result.values[0].title === "test post 1" && result.values[1].title === "test post 2" ? true : false;
            if(retQuery2) document.querySelector('.query2').classList.remove('display'); 

            // Close the Database
            result = await this._SQLiteService.close("test-sqlite");
            const retClose = result.result

            if (retClose) document.querySelector('.close').classList.remove('display'); 
            let ret = false;
            if(retEx2 && retQuery1 && retRun1 && retRun2 && retQuery3 && retQuery4 &&
              retEx3 && retQuery2 && retClose) ret = true;
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
  async testImportFromJson():Promise<boolean> {
    return new Promise(async (resolve) => {
      let ret:boolean = true;
      const dataToImport: any = {
        database : "db-from-json",
        encrypted : false,
        mode : "full",
        tables :[
            {
                name: "users",
                schema: [
                    {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
                    {column:"email", value:"TEXT UNIQUE NOT NULL"},
                    {column:"name", value:"TEXT"},
                    {column:"age", value:"INTEGER"}
                ],
                indexes: [
                    {name: "index_user_on_name",
                     column: "name"   
                    }
                ],
                values: [
                    [1,"Whiteley.com","Whiteley",30],
                    [2,"Jones.com","Jones",44],
                    [3,"Simpson@example.com","Simpson",69],
                    [4,"Brown@example.com","Brown",15]
                ]
            },
            {
              name: "messages",
              schema: [
                {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
                {column:"title", value:"TEXT NOT NULL"},
                {column:"body", value:"TEXT NOT NULL"}
              ],
              values: [
                  [1,"test post 1","content test post 1"],
                  [2,"test post 2","content test post 2"]
              ]
            }
    
        ]
      };
     
      let result:any = await this._SQLiteService.importFromJson(JSON.stringify(dataToImport));
      console.log('import result ',result)
      if(result.changes === -1 ) ret = false;
      if(ret) {
        const partialImport1: any = {
          database : "db-from-json",
          encrypted : false,
          mode : "partial",
          tables :[
              {
                  name: "users",
                  values: [
                      [5,"Addington.com","Addington",22],
                      [6,"Bannister.com","Bannister",59],
                      [2,"Jones@example.com","Jones",45],

                  ]
              },
              {
                name: "messages",
                indexes: [
                  {name: "index_messages_on_title",
                   column: "title"   
                  }
                ],
                values: [
                    [3,"test post 3","content test post 3"],
                    [4,"test post 4","content test post 4"]
                ]
              }
      
          ]
        }; 
        let result:any = await this._SQLiteService.importFromJson(JSON.stringify(partialImport1));
        if(result.changes === -1 ) ret = false;
      }
      if(!ret) console.log("importFromJson: Error " + result.message);
      resolve(ret);
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
        const retEx1 = result.changes === 0 || result.changes === 1 ? true : false;
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
          const retEx2 = result.changes === 0 || result.changes === 1 ? true : false;
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
      if(!result.result) {
        resolve(true);
      } else {
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
        result = await this._SQLiteService.close("test-encrypted");
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
