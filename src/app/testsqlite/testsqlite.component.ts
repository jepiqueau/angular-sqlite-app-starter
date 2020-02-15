import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { concatAll } from 'rxjs/operators';
import { Observable, concat} from 'rxjs';

@Component({
  selector: 'app-testsqlite',
  templateUrl: './testsqlite.component.html',
  styleUrls: ['./testsqlite.component.scss'],
})
export class TestsqliteComponent implements AfterViewInit {
  platform: string;
  noEncryption: boolean = false;
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
        if(!this.noEncryption ) {     
          document.querySelector('.sql-failure1').classList.remove('display');
        } else {
          console.log("***** End testDatabase *****")
          document.querySelector('.sql-success1').classList.remove('display');
        }
        if(this.noEncryption) {
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
      if(!this.initTest || !this.noEncryption || !this.encryption || !this.encrypted || 
        !this.wrongSecret || !this.changeSecret || !this.newSecret) {     
        document.querySelector('.sql-allfailure').classList.remove('display');
      } else {
        document.querySelector('.sql-allsuccess').classList.remove('display');
      }

    } else {
      this.platform = this._SQLiteService.platform.charAt(0).toUpperCase() + 
      this._SQLiteService.platform.slice(1);
      if(this._SQLiteService.platform === "web" || this._SQLiteService.platform === "electron") {
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
    return new Promise((resolve) => {
      // delete databases to enable test restart
      // as after the first pass the database is encrypted
      if(this._SQLiteService.platform === "ios" || this._SQLiteService.platform === "android") {
        this._SQLiteService.deleteDB("test-sqlite") 
        .subscribe(result => {
          console.log("delete database test-sqlite ",result.result);
          this._SQLiteService.deleteDB("test-encrypted") 
          .subscribe(result => {
            console.log("delete database test-encrypted ",result.result);
            this._SQLiteService.getEcho("Hello from JEEP")
            .subscribe(echo => console.log("*** echo ",echo));
            resolve(true);
          }); 
        });
      } else {
        resolve(false);
      }
    });
  }
  /**
  * Test a non-encrypted database
  */
  async testNoEncryption(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      // open the database
      this._SQLiteService.openDB("test-sqlite") 
      .subscribe(result => {
        console.log('result.result ',result.result)
        if(result.result) {
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
          PRAGMA user_version = 1;
          COMMIT TRANSACTION;
          `;
          this._SQLiteService.execute(sqlcmd)
          .subscribe(result => {
            if(result.changes === 0 || result.changes === 1) {
              document.querySelector('.execute1').classList.remove('display'); 
              let UsersObservables: Observable<any>[]=[];
              let MessagesObservables: Observable<any>[]=[];
              let AllObservables: Observable<any>[]=[]; 

              // Insert some Users
              /*
              INSERT INTO users (name,email,age) VALUES ("Whiteley","Whiteley.com",30);
              INSERT INTO users (name,email,age) VALUES ("Jones","Jones.com",44);
              */
              const row: Array<Array<any>> = [["Whiteley","Whiteley.com",30],["Jones","Jones.com",44]];
              let sqlcmd: string = `
              BEGIN TRANSACTION;
              DELETE FROM users;
              INSERT INTO users (name,email,age) VALUES ("${row[0][0]}","${row[0][1]}",${row[0][2]});
              INSERT INTO users (name,email,age) VALUES ("${row[1][0]}","${row[1][1]}",${row[1][2]});
              COMMIT TRANSACTION;
              `;
              UsersObservables.push(this._SQLiteService.execute(sqlcmd));
              // Select all Users
              sqlcmd = "SELECT * FROM users";
              UsersObservables.push(this._SQLiteService.query(sqlcmd));
              // add one user with statement and values              
              sqlcmd = "INSERT INTO users (name,email,age) VALUES (?,?,?)";
              let values: Array<any>  = ["Simpson","Simpson@example.com",69];
              UsersObservables.push(this._SQLiteService.run(sqlcmd,values));
              // add one user with statement              
              sqlcmd = `INSERT INTO users (name,email,age) VALUES ("Brown","Brown@example.com",15)`;
              UsersObservables.push(this._SQLiteService.run(sqlcmd));
              // Select all Users
              sqlcmd = "SELECT * FROM users";
              UsersObservables.push(this._SQLiteService.query(sqlcmd));
              // Select Users with age > 35
              sqlcmd = "SELECT name,email,age FROM users WHERE age > ?";
              values = ["35"];
              UsersObservables.push(this._SQLiteService.query(sqlcmd,values));
              // Insert some Messages
              sqlcmd = `
              BEGIN TRANSACTION;
              DELETE FROM messages;
              INSERT INTO messages (title,body) VALUES ("test post 1","content test post 1");
              INSERT INTO messages (title,body) VALUES ("test post 2","content test post 2");
              COMMIT TRANSACTION;
              `;
              MessagesObservables.push(this._SQLiteService.execute(sqlcmd));
              // Select all Messages
              sqlcmd = "SELECT * FROM messages";
              MessagesObservables.push(this._SQLiteService.query(sqlcmd));
              // Close the Database
              MessagesObservables.push(this._SQLiteService.close("test-sqlite"));

              // Create one Observable to subscribe
              let resultOb: Array<any> = [];
              let results: Array<boolean> = [];
              
              const usersOb = concat(UsersObservables);
              const usersObs = usersOb.pipe(concatAll());
              const messagesOb = concat(MessagesObservables);
              const messagesObs = messagesOb.pipe(concatAll());
              AllObservables.push(usersObs);
              AllObservables.push(messagesObs);
              const allOb = concat(AllObservables);
              const allObs = allOb.pipe(concatAll());
              allObs.subscribe((result: any) => {
                resultOb = [...resultOb, result];
                },
                (e:any) => {
                  console.log('onError: %s', e);
                  resolve(false);
                },
                () => {
                  resultOb.forEach((element:any,index:number) => {
                    let res: boolean = false;
                    if(index === 0 && element.changes === 1) {
                      res = true;
                      document.querySelector('.execute2').classList.remove('display'); 
                    }
                    if(index === 1 && element.values.length === 2 &&
                      element.values[0].name === "Whiteley" && element.values[1].name === "Jones") {
                      document.querySelector('.query1').classList.remove('display'); 
                      res = true;       
                    }
                    if(index === 2 && element.changes === 1) {
                      res = true;
                      document.querySelector('.run1').classList.remove('display');        
                    }
                    if(index === 3 && element.changes === 1) {
                      res = true;
                      document.querySelector('.run2').classList.remove('display');        
                    }
                    if(index === 4 && element.values.length === 4) {
                      document.querySelector('.query3').classList.remove('display'); 
                      res = true;                           
                    }
                    if(index === 5 && element.values.length === 2) {
                      document.querySelector('.query4').classList.remove('display'); 
                      res = true;                           
                    }
                    if(index === 6 && element.changes === 1) {
                      res = true;
                      document.querySelector('.execute3').classList.remove('display'); 
                    }
                    if(index === 7 && element.values.length === 2 &&
                        element.values[0].title === "test post 1" && element.values[1].title === "test post 2") {
                      document.querySelector('.query2').classList.remove('display'); 
                      res = true;       
                    }
                    if(index === 8 && element.result) {
                      document.querySelector('.close').classList.remove('display'); 
                      res = true;                           
                    }
                    results = [...results,res];
                    if(index === resultOb.length -1) {
                      if(results.indexOf(false) === -1) {
                        resolve(true);       
                      } else {
                        resolve(false);
                      }
                    }
                  });

                }
              );

            } else {
              resolve(false);
            }
          });
        } else {
          console.log("*** Error: Database test-sqlite not opened");
          resolve(false);
        }
      });   
    });
  }

  /**
  * Test an encrypted database
  */
  async testEncryptedDatabase(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      // open the database
      this._SQLiteService.openDB("test-encrypted",true,"secret") 
      .subscribe(result => {
        if(result.result) {
          console.log("*** Database test-encrypted Opened");
          let ContactsObservables: Observable<any>[]=[];
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
          ContactsObservables.push(this._SQLiteService.execute(sqlcmd));
          // Insert some Contacts
          sqlcmd = `
          BEGIN TRANSACTION;
          DELETE FROM contacts;
          INSERT INTO contacts (name,email) VALUES ("Whiteley","Whiteley.com");
          INSERT INTO contacts (name,email) VALUES ("Jones","Jones.com");
          COMMIT TRANSACTION;
          `;
          ContactsObservables.push(this._SQLiteService.execute(sqlcmd));
          // Select all Contacts
          sqlcmd = "SELECT * FROM contacts";
          ContactsObservables.push(this._SQLiteService.query(sqlcmd));
          // Close the Database
          ContactsObservables.push(this._SQLiteService.close("test-encrypted"));

          // Create one Observable to subscribe
          let resultOb: Array<any> = [];
          let results: Array<boolean> = [];
            
          const contactsOb = concat(ContactsObservables);
          const contactsObs = contactsOb.pipe(concatAll());
          contactsObs.subscribe((result: any) => {
            resultOb = [...resultOb, result];
            },
            (e:any) => {
              console.log('onError: %s', e);
              resolve(false);
            },
            () => {
              resultOb.forEach((element:any,index:number) => {
                let res: boolean = false;
                if(index === 0 && (element.changes === 0 || element.changes === 1)) {
                  res = true;
                }
                if(index === 1 && element.changes >= 1) {
                  res = true;
                }
                if(index === 2 && element.values.length === 2 &&
                  element.values[0].name === "Whiteley" && element.values[1].name === "Jones") {
                  res = true;
                }
                if(index === 3 && element.result) {
                  res = true;                           
                }

                results = [...results,res];
                if(index === resultOb.length -1) {
                  if(results.indexOf(false) === -1) {
                    resolve(true);       
                  } else {
                    resolve(false);
                  }
                }
              });
            }
          );
        }else {
          console.log("*** Error: Database test-encrypted not opened");
          resolve(false);
        }
      });
    });
  }
  /**
  * Try opening an encrypted database with wrong secret
  */
  async testWrongSecret(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      // open the database
      this._SQLiteService.openDB("test-encrypted",true,"wrongsecret") 
      .subscribe(result => {
        if(!result.result) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  /**
  * Change the secret of an encrypted database
  */
  async testChangePassword(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      // open the database
      this._SQLiteService.openDB("test-encrypted",true,"newsecret") 
      .subscribe(result => {
        if(result.result) {
          console.log("*** Database test-encrypted Opened");
          let ContactsObservables: Observable<any>[]=[];
          let sqlcmd: string = "SELECT * FROM contacts";
          ContactsObservables.push(this._SQLiteService.query(sqlcmd));
          // Close the Database
          ContactsObservables.push(this._SQLiteService.close("test-encrypted"));

          // Create one Observable to subscribe
          let resultOb: Array<any> = [];
          let results: Array<boolean> = [];
            
          const contactsOb = concat(ContactsObservables);
          const contactsObs = contactsOb.pipe(concatAll());
          contactsObs.subscribe((result: any) => {
            resultOb = [...resultOb, result];
            },
            (e:any) => {
              console.log('onError: %s', e);
              resolve(false);
            },
            () => {
              resultOb.forEach((element:any,index:number) => {
                let res: boolean = false;
                if(index === 0 && element.values.length === 2 &&
                  element.values[0].name === "Whiteley" && element.values[1].name === "Jones") {
                  res = true;
                }
                if(index === 1 && element.result) {
                  res = true;                           
                }

                results = [...results,res];
                if(index === resultOb.length -1) {
                  if(results.indexOf(false) === -1) {
                    resolve(true);       
                  } else {
                    resolve(false);
                  }
                }
              });
            }
          );
        } else {
          console.log("*** Error: Database test-encrypted not opened");
          resolve(false);
        }
      });
    });
  }
  /**
  * Open an encrypted database after having change the secret
  */
  async testDatabaseNewPassword(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      // open the database
      this._SQLiteService.openDB("test-encrypted",true,"secret") 
      .subscribe(result => {
        if(result.result) {
          console.log("*** Database test-encrypted Opened");
          let ContactsObservables: Observable<any>[]=[];
          let sqlcmd: string = "SELECT * FROM contacts";
          ContactsObservables.push(this._SQLiteService.query(sqlcmd));
          // Close the Database
          ContactsObservables.push(this._SQLiteService.close("test-encrypted"));

          // Create one Observable to subscribe
          let resultOb: Array<any> = [];
          let results: Array<boolean> = [];
            
          const contactsOb = concat(ContactsObservables);
          const contactsObs = contactsOb.pipe(concatAll());
          contactsObs.subscribe((result: any) => {
            resultOb = [...resultOb, result];
            },
            (e:any) => {
              console.log('onError: %s', e);
              resolve(false);
            },
            () => {
              resultOb.forEach((element:any,index:number) => {
                let res: boolean = false;
                if(index === 0 && element.values.length === 2 &&
                  element.values[0].name === "Whiteley" && element.values[1].name === "Jones") {
                  res = true;
                }
                if(index === 1 && element.result) {
                  res = true;                           
                }

                results = [...results,res];
                if(index === resultOb.length -1) {
                  if(results.indexOf(false) === -1) {
                    resolve(true);       
                  } else {
                    resolve(false);
                  }
                }
              });
            }
          );
        } else {
          console.log("*** Error: Database test-encrypted not opened");
          resolve(false);
        }
      });
    });
  }
  /**
  * Encrypt a Non-Encrypted Database
  */
  async testEncryptionDatabase(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      // open the database
      this._SQLiteService.openDB("test-sqlite",true,"encryption") 
      .subscribe(result => {
        if(result.result) {
          let Observables: Observable<any>[]=[];

          // Select all Users
          let sqlcmd:string = "SELECT * FROM users";
          Observables.push(this._SQLiteService.query(sqlcmd));
          // Select all Messages
          sqlcmd = "SELECT * FROM messages";
          Observables.push(this._SQLiteService.query(sqlcmd));
          // Close the Database
          Observables.push(this._SQLiteService.close("test-sqlite"));
          const Ob = concat(Observables);
          const Obs = Ob.pipe(concatAll());
          let resultOb: Array<any> = [];
          let results: Array<boolean> = [];

          Obs.subscribe((result: any) => {
            resultOb = [...resultOb, result];
            },
            (e:any) => {
              console.log('onError: %s', e);
              resolve(false);
            },
            () => {
              resultOb.forEach((element:any,index:number) => {
                let res: boolean = false;
                if(index === 0 && element.values.length === 4 &&
                  element.values[0].name === "Whiteley" && element.values[1].name === "Jones" &&
                  element.values[2].name === "Simpson" && element.values[3].name === "Brown") {
                  res = true;       
                }
                if(index === 1 && element.values.length === 2 &&
                  element.values[0].title === "test post 1" && element.values[1].title === "test post 2") {
                  res = true;       
                }
                if(index === 2 && element.result) {
                  res = true;                           
                }
                results = [...results,res];
                if(index === resultOb.length -1) {
                  if(results.indexOf(false) === -1) {
                    resolve(true);       
                  } else {
                    resolve(false);
                  }
                }
              });
            }
          );
        } else {
          console.log("*** Error: Database test-sqlite not opened");
          resolve(false);
        }
      });
    });
  }
}
