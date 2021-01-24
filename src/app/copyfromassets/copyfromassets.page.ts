import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';

@Component({
  selector: 'app-copyfromassets',
  templateUrl: 'copyfromassets.page.html',
  styleUrls: ['copyfromassets.page.scss']
})
export class CopyfromassetsPage implements AfterViewInit {
  log: string = "";
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
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
    console.log("%%%% in CopyfromassetsPage this._sqlite " + this._sqlite)
    this.log += "* Starting testDatabaseCopyFromAssets *\n";
    let result: any = await this._sqlite.echo("Hello World");
    console.log(" from Echo " + result.value);
    let res: any = await this._sqlite.copyFromAssets();
    if(!res.result) return false;
    this.log  +="  > copyFromAssets successful\n";
    // create a connection for myDB
    let db = await this._sqlite
                .createConnection("myDB", false, "no-encryption", 1);
    if(db == null ) return false;
    this.log += "  > createConnection 'myDb' successful\n";
    res = await db.open();
    if(!res.result) return false;
    this.log += "  > open 'myDb' successful\n";
    // Select all Users
    res = await db.query("SELECT * FROM users");
    console.log(`@@@ res.values.length ${res.values.length}`)
    if(res.values.length !== 7 ||
        res.values[0].name !== "Whiteley" ||
        res.values[1].name !== "Jones" ||
        res.values[2].name !== "Simpson" ||
        res.values[3].name !== "Brown" ||
        res.values[4].name !== "Jackson" ||
        res.values[5].name !== "Kennedy" ||
        res.values[6].name !== "Bush") return false;

    this.log += "  > query 'myDb' successful\n";

    // Close Connection MyDB        
    res = await this._sqlite.closeConnection("myDB"); 
    if(!res.result) {
        return false; 
    }
    this.log += "  > closeConnection 'myDb' successful\n";

    // create a connection for dbForCopy
    db = await this._sqlite
          .createConnection("dbForCopy", false, "no-encryption", 1);
    if(db == null ) return false;
    this.log += "  > createConnection 'dbForCopy' successful\n";
    res = await db.open();
    if(!res.result) return false;
    this.log += "  > open 'dbForCopy' successful\n";
    // Select all Users
    res = await db.query("SELECT * FROM areas");
    console.log(`@@@ res.values.length ${res.values.length}`)
    if(res.values.length !== 3 ||
        res.values[0].name !== "Access road" ||
        res.values[1].name !== "Accessway" ||
        res.values[2].name !== "Air handling system") return false;

    this.log += "  > query 'dbForCopy' successful\n";
    // Close Connection dbForCopy       
    res = await this._sqlite.closeConnection("dbForCopy"); 
    if(!res.result) {
        return false; 
    }
    this.log += "  > closeConnection 'dbForCopy' successful\n";
            
    this.log += "* Ending testDatabaseCopyFromAssets *\n";
    return true;
  }

}
