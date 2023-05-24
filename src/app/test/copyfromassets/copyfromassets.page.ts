import { Component, OnInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-copyfromassets',
  templateUrl: 'copyfromassets.page.html',
  styleUrls: ['copyfromassets.page.scss']
})
export class CopyfromassetsPage implements OnInit {
  log: string = "";
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {
    this.platform = this._sqlite.platform;
  }

  async ngOnInit() {
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    try {
      await this.runTest();
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } catch (err) {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log(`$$$ runTest failed ${err.message}`);
      await showAlert(err.message);
    }
  }


  async runTest(): Promise<void> {
    try {
      this.log += "* Starting testDatabaseCopyFromAssets *\n";
      let result: any = await this._sqlite.echo("Hello World");
      await this._sqlite.copyFromAssets();
      this.log  +="  > copyFromAssets successful\n";
      // create a connection for myData
      const db2 = await this._sqlite
      .createConnection("myData1", false, "no-encryption", 1);
      if(db2 == null ) return Promise.reject(new Error("createConnection data failed"));
      this.log += "  > createConnection 'myData1' successful\n";
      await db2.open();
      this.log += "  > open 'myData1' successful\n";
      let resData: any = await db2.query("SELECT * FROM media");
      console.log(`resData: ${JSON.stringify(resData)}`)
      if(resData.values.length !== 1) {
        return Promise.reject(new Error("data query failed"));
      }
      console.log(`file_name: ${resData.values[0]["file_name"]}`);
      console.log(`caption: ${resData.values[0].caption}`);
      await this._sqlite.closeConnection("myData1");

      // create a connection for myDB
      let db = await this._sqlite
                  .createConnection("myDB", false, "no-encryption", 1);
      if(db == null ) return Promise.reject(new Error("createConnection myDB failed"));
      this.log += "  > createConnection 'myDb' successful\n";
      await db.open();
      this.log += "  > open 'myDb' successful\n";
      // Select all Users
      let res: any = await db.query("SELECT * FROM users");
      if(res.values.length !== 7 ||
          res.values[0].name !== "Whiteley" ||
          res.values[1].name !== "Jones" ||
          res.values[2].name !== "Simpson" ||
          res.values[3].name !== "Brown" ||
          res.values[4].name !== "Jackson" ||
          res.values[5].name !== "Kennedy" ||
          res.values[6].name !== "Bush")  return Promise.reject(new Error("Query 7 users failed"));

      this.log += "  > query 'myDb' successful\n";

      // Close Connection MyDB
      await this._sqlite.closeConnection("myDB");
      this.log += "  > closeConnection 'myDb' successful\n";

      // create a connection for dbForCopy
      db = await this._sqlite
            .createConnection("dbForCopy", false, "no-encryption", 1);
      if(db == null ) return Promise.reject(new Error("createConnection dbForCopy failed"));

      this.log += "  > createConnection 'dbForCopy' successful\n";
      await db.open();
      this.log += "  > open 'dbForCopy' successful\n";
      // Select all Users
      res = await db.query("SELECT * FROM areas");
      console.log(`res: ${JSON.stringify(res)}`);
      if(res.values.length !== 4 ||
          res.values[0].name !== "Access road" ||
          res.values[1].name !== "Accessway" ||
          res.values[2].name !== "Air handling system" ||
          res.values[3].name !== "Fabio Stergulc, Università di Udine, Bugwood.org") return Promise.reject(new Error("Query 3 areas failed"));

      this.log += "  > query 'dbForCopy' successful\n";
      // Close Connection dbForCopy
      await this._sqlite.closeConnection("dbForCopy");
      this.log += "  > closeConnection 'dbForCopy' successful\n";

      this.log += "* Ending testDatabaseCopyFromAssets *\n";
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }

  }

}
