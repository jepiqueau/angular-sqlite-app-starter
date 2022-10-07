import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { SQLiteService } from '../../services/sqlite.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-downloadfromhttp',
  templateUrl: 'downloadfromhttp.page.html',
  styleUrls: ['downloadfromhttp.page.scss']
})
export class DownloadFromHTTP implements OnInit {
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
    this.log += "* Starting testDownloadFromHTTP *\n";
    const url = "https://raw.githack.com/jepiqueau/angular-sqlite-app-starter/26ca67486713fc9b6ea4a37a889f0fd189c18926/src/assets/databases/dbForCopy.db";
    const url1 = "https://raw.githack.com/jepiqueau/angular-sqlite-app-starter/26ca67486713fc9b6ea4a37a889f0fd189c18926/src/assets/databases/Archive.zip";
    try {
      // *** test a db file ***
      await this._sqlite.getFromHTTPRequest(url, true);
      this.log += "  > fetched 'dbForCopy' from github\n";
      let db = await this._sqlite.createConnection("dbForCopy", false, "no-encryption", 1);
      if (db == null) throw new Error("createConnection dbForCopy failed");
      await db.open();
      this.log += "  > open 'dbForCopy' successful\n";
      let res = await db.query("SELECT * FROM areas");
      if (res.values.length !== 3 ||
        res.values[0].name !== "Access road" ||
        res.values[1].name !== "Accessway" ||
        res.values[2].name !== "Air handling system") {
        throw new Error("Query 3 areas failed");
      }
      this.log += "  > query 'dbForCopy' successful\n";
      await this._sqlite.closeConnection("dbForCopy");
      this.log += "  > closeConnection 'dbForCopy' successful\n";
      // *** test a zipped file ***
      await this._sqlite.getFromHTTPRequest(url1, true);
      this.log += "  > fetched 'Archive' from github\n";
      const db1 = await this._sqlite.createConnection("dbZip1", false, "no-encryption", 1);
      if (db1 == null) throw new Error("createConnection dbZip1 failed");
      await db1.open();
      this.log += "  > open 'dbZip1' successful\n"; 
      const retTables = await db1.getTableList();
      console.log(`>>> retTables: ${JSON.stringify(retTables)}`);
      if(retTables.values.length !== 3 ||
        !retTables.values.includes("areas") ||
        !retTables.values.includes("elements") ||
        !retTables.values.includes("issues")
      ) {
        return Promise.reject("GetTableList dbZip1 Tables failed");
      }
      const resAreas = await db1.query("SELECT * FROM areas");
      if (resAreas.values.length !== 3 ||
        resAreas.values[0].name !== "Access road" ||
        resAreas.values[1].name !== "Accessway" ||
        resAreas.values[2].name !== "Air handling system") {
        throw new Error("Query 3 areas failed");
      }
      this.log += "  > query 'dbZip1' successful\n";
      await this._sqlite.closeConnection("dbZip1");
      this.log += "  > closeConnection 'dbZip1' successful\n";
      const db2 = await this._sqlite.createConnection("dbZip2", false, "no-encryption", 1);
      if (db2 == null) throw new Error("createConnection dbZip2 failed");
      await db2.open();
      this.log += "  > open 'dbZip2' successful\n";
      const resUsers = await db2.query("SELECT * FROM users");
      if (resUsers.values.length !== 7) {
        throw new Error("Query dbZip2 Users failed");
      }
      this.log += "  > query 'dbZip2' successful\n";
      await this._sqlite.closeConnection("dbZip2");
      this.log += "  > closeConnection 'dbZip2' successful\n";

    } catch (err) {
      return Promise.reject(err);
    }
  }
}
