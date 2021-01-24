import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { createSchema, twoUsers} from '../utils/no-encryption-utils';
import { deleteDatabase } from '../utils/db-utils';

@Component({
  selector: 'app-testencryption',
  templateUrl: 'testencryption.page.html',
  styleUrls: ['testencryption.page.scss']
})
export class TestencryptionPage implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
    console.log("%%%% in TestencryptionPage this._sqlite " + this._sqlite)

    const result: boolean = await this.runTest();
    if(result) {
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } else {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log("$$$ runTest failed");
    }
  }


  async runTest(): Promise<boolean> {
    let result: any = await this._sqlite.echo("Hello World");
    console.log(" from Echo " + result.value);

    // ************************************************
    // Create Database No Encryption
    // ************************************************

    // initialize the connection
    let db = await this._sqlite
                .createConnection("testEncryption", false, "no-encryption", 1);

    // open db testEncryption
    let ret: any = await db.open();
    if (!ret.result) {
      return false;
    }

    // create tables in db
    ret = await db.execute(createSchema);
    console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
    if (ret.changes.changes < 0) {
      return false;
    }

    // create synchronization table 
    ret = await db.createSyncTable();
    if (ret.changes.changes < 0) {
      return false;
    }
    
    // set the synchronization date
    const syncDate: string = "2020-11-25T08:30:25.000Z";
    ret = await db.setSyncDate(syncDate);
    if(!ret.result) return false;


    // add two users in db
    ret = await db.execute(twoUsers);
    if (ret.changes.changes !== 2) {
      return false;
    }
    // select all users in db
    ret = await db.query("SELECT * FROM users;");
    if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                  ret.values[1].name !== "Jones") {
      return false;
    }

    // select users where company is NULL in db
    ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
    if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                  ret.values[1].name !== "Jones") {
      return false;
    }
    // add one user with statement and values              
    let sqlcmd: string = 
                "INSERT INTO users (name,email,age) VALUES (?,?,?)";
    let values: Array<any>  = ["Simpson","Simpson@example.com",69];
    ret = await db.run(sqlcmd,values);
    console.log()
    if(ret.changes.lastId !== 3) {
      return false;
    }
    // add one user with statement              
    sqlcmd = `INSERT INTO users (name,email,age) VALUES ` + 
                              `("Brown","Brown@example.com",15)`;
    ret = await db.run(sqlcmd);
    if(ret.changes.lastId !== 4) {
      return false;
    }

    ret = await this._sqlite.closeConnection("testEncryption"); 
    if(!ret.result) {
      return false; 
    }

    // ************************************************
    // Encrypt the existing database
    // ************************************************

    // initialize the connection
    db = await this._sqlite
                .createConnection("testEncryption", true, "encryption", 1);

    // open db testEncryption
    ret = await db.open();
    console.log("open encrypted " + JSON.stringify(ret))
    if (!ret.result) {
      return false;
    }
    // close the connection
    ret = await this._sqlite.closeConnection("testEncryption"); 
    console.log("closeConnection encrypted " + JSON.stringify(ret))
    if(!ret.result) {
      return false; 
    }
    // ************************************************
    // Work with the encrypted  database
    // ************************************************

    // initialize the connection
    db = await this._sqlite
                .createConnection("testEncryption", true, "secret", 1);

    // open db testEncryption
    ret = await db.open();
    console.log("open encrypted " + JSON.stringify(ret))
    if (!ret.result) {
      return false;
    }

    // add one user with statement and values              
    sqlcmd = 
                "INSERT INTO users (name,email,age) VALUES (?,?,?)";
    values = ["Jackson","Jackson@example.com",32];
    ret = await db.run(sqlcmd,values);
    console.log("insert encrypted " + JSON.stringify(ret))
    if(ret.changes.lastId !== 5) {
      return false;
    }

    // select all users in db
    ret = await db.query("SELECT * FROM users;");
    console.log("query encrypted " + ret.values.length )
    if(ret.values.length !== 5 || ret.values[0].name !== "Whiteley" ||
                                  ret.values[1].name !== "Jones" ||
                                  ret.values[2].name !== "Simpson" ||
                                  ret.values[3].name !== "Brown" ||
                                  ret.values[4].name !== "Jackson") {
      return false;
    }

    // delete it for multiple successive tests
    ret = await deleteDatabase(db);
    console.log("delete database encrypted " + JSON.stringify(ret))
    
    ret = await this._sqlite.closeConnection("testEncryption"); 
    console.log("closeConnection encrypted " + JSON.stringify(ret))
    if(!ret.result) {
      return false; 
    } else {
      return true;
    }

  }

}
