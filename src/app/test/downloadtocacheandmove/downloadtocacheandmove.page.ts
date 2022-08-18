import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { SQLiteService } from '../../services/sqlite.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-downloadtocacheandmove',
  templateUrl: 'downloadtocacheandmove.page.html',
  styleUrls: ['downloadtocacheandmove.page.scss']
})
export class DownloadToCacheAndMove implements OnInit {
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
    this.log += "* Starting testDownloadToCacheAndMove *\n";
    let response = await fetch("https://raw.githack.com/jepiqueau/angular-sqlite-app-starter/26ca67486713fc9b6ea4a37a889f0fd189c18926/src/assets/databases/dbForCopy.db");
    this.log += "  > fetched 'dbForCopy' from github\n";
    let dbBlob = await response.blob();
    let base64Db = await this.getBlobAsBase64(dbBlob);
    this.log += "  > converted 'dbForCopy' to base64\n";
    await Filesystem.writeFile({ data: base64Db, path: "dbForCopyCache.db", directory: Directory.Cache });
    this.log += "  > saved 'dbForCopyCache.db' in cache folder\n";
    await this._sqlite.moveDatabasesAndAddSuffix("cache");
    this.log += "  > moved 'dbForCopyCache' to databases folder\n";
    let db = await this._sqlite.createConnection("dbForCopyCache", false, "no-encryption", 1);
    if (db == null) throw new Error("createConnection dbForCopyCache failed");
    await db.open();
    this.log += "  > open 'dbForCopyCache' successful\n";
    let res = await db.query("SELECT * FROM areas");
    if (res.values.length !== 3 ||
      res.values[0].name !== "Access road" ||
      res.values[1].name !== "Accessway" ||
      res.values[2].name !== "Air handling system") {
      throw new Error("Query 3 areas failed");
    }
    this.log += "  > query 'dbForCopyCache' successful\n";
    await this._sqlite.closeConnection("dbForCopyCache");
    this.log += "  > closeConnection 'dbForCopyCache' successful\n";
  }

  private getBlobAsBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(blob);
    });
  }

}
