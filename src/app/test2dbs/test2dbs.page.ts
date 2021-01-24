import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';

import { createSchema, twoUsers, twoTests } from '../utils/no-encryption-utils';
import { createSchemaContacts, setContacts } from '../utils/encrypted-set-utils';
import { deleteDatabase } from '../utils/db-utils';

@Component({
  selector: 'app-test2dbs',
  templateUrl: 'test2dbs.page.html',
  styleUrls: ['test2dbs.page.scss']
})
export class Test2dbsPage implements AfterViewInit {
  detail: boolean = false;
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {}

  async ngAfterViewInit() {
    console.log("%%%% in Test2dbsPage this._sqlite " + this._sqlite)
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
    // initialize the connection
    const db = await this._sqlite
                .createConnection("testNew", false, "no-encryption", 1);
    console.log("db " + db)
    const db1 = await this._sqlite
                .createConnection("testSet", true, "secret", 1);

    // check if the databases exist 
    // and delete it for multiple successive tests
    let ret: any = await deleteDatabase(db);
    ret = await deleteDatabase(db1);

    // open db testNew
    ret = await db.open();
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

    // open db testSet
    ret = await db1.open();
    if (!ret.result) {
      return false;
    }
    // create tables in db1
    ret = await db1.execute(createSchemaContacts);
    console.log('$$$ ret.changes.changes in db1' + ret.changes.changes)
    if (ret.changes.changes < 0) {
      return false;
    }
    // load setContacts in db1
    ret = await db1.executeSet(setContacts);
    console.log('$$$ ret.changes.changes in db1' + ret.changes.changes)
    if (ret.changes.changes !== 5) {
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
    // add some tests issue#56
    ret = await db.execute(twoTests);
    if (ret.changes.changes !== 2) {
      return false;
    }
    // add one test
    sqlcmd = "INSERT INTO test56 (name) VALUES (?)";
    let vals: Array<any>  = ["test 3 added insert "];
    ret = await db.run(sqlcmd,vals);
    if (ret.changes.changes !== 1 || ret.changes.lastId !== 3) {
      return false;
    }
    // add a null test
    vals  = [null];
    ret = await db.run(sqlcmd,vals);
    if (ret.changes.changes !== 1 || ret.changes.lastId !== 4) {
      return false;
    }
    // add a another null test
    vals  = [];
    ret = await db.run(sqlcmd,vals);
    if (ret.changes.changes !== 1 || ret.changes.lastId !== 5) {
      return false;
    }
    // add test [null, 'test2']
    sqlcmd = "INSERT INTO test56 (name,name1) VALUES (?,?)";
    vals = [null, 'test2']
    ret = await db.run(sqlcmd,vals);
    console.log("test [null,'test2' ]" + ret.changes.changes + " " +
                ret.changes.lastId);
    if (ret.changes.changes !== 1 || ret.changes.lastId !== 6) {
      return false;
    }

    // add in a wrong table
    sqlcmd = "INSERT INTO test (name) VALUES (?)";
    vals  = ["test wrong table "];
    ret = await db.run(sqlcmd,vals);
    console.log('$$$ wrong table ret.changes.changes in db' + ret.changes.changes)
    if (ret.changes.changes !== -1 ) {
      return false;    

/*
    }

    ret = await this._sqlite.closeConnection("testNew"); 
    if(!ret.result) {
      return false; 
    }
    ret = await this._sqlite.closeConnection("testSet"); 
    if(!ret.result) {
      return false; 
*/
    } else {
      this._detailService.setExistingConnection(true);
      return true;
    }

  }

}
