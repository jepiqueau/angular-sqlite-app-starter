import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';

import { createSchema, twoUsers, twoTests } from '../utils/no-encryption-utils';
import { createSchemaContacts, setContacts, setIssue170 } from '../utils/encrypted-set-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-testncdbs',
  templateUrl: 'testncdbs.page.html',
  styleUrls: ['testncdbs.page.scss']
})
export class TestNCDbsPage implements AfterViewInit {
  detail: boolean = false;
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {
      this.platform = this._sqlite.platform;
  }

  async ngAfterViewInit() {
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
      let result: any = await this._sqlite.echo("Hello World from Jeep");
      console.log(`from echo: ${result.value}`);

      let directory: string;
      if(this.platform === "ios") directory = "Applications/Files/Databases"
      if(this.platform === "android" ) directory = "files/databases";  
      if(this.platform === 'ios' || this.platform === 'android') {
        const databasePath = (await this._sqlite.getNCDatabasePath(directory,"testncdb.db")).path;
        const isNCDbExists = (await this._sqlite.isNCDatabase(databasePath)).result;
        const ret = await this._sqlite.checkConnectionsConsistency();
        const isConn = (await this._sqlite.isNCConnection(databasePath)).result;
        let db: SQLiteDBConnection
        if (ret.result && isConn && isNCDbExists) {
          db = await this._sqlite.retrieveNCConnection(databasePath);
        } else {
          db = await this._sqlite.createNCConnection(databasePath, 1);
        }
        // open db testncdb.db
        await db.open();
        // get the database version
        let retVer = await db.getVersion();
        if (retVer.version !== 1) {
          return Promise.reject(new Error("GetVersion: version failed"));
        }
        const isDbOpen = await db.isDBOpen();
        console.log(`$$$$ isDbOpen.result ${JSON.stringify(isDbOpen.result)}`)
        if(!isDbOpen.result) {
          return Promise.reject(new Error("IsDBOpen: database not opened"));
        }

        const isTable = await db.isTable("contacts")
        console.log(`$$$$ isTable.result ${JSON.stringify(isTable.result)}`)
        if(!isTable.result) {
          return Promise.reject(new Error("IsTable: table does not exist"));
        }
        // select all contacts in db
        const retCts = await db.query("SELECT * FROM contacts;");
        if(retCts.values.length !== 4 || 
              retCts.values[0].name !== "Simpson" ||
              retCts.values[1].name !== "Jones" ||
              retCts.values[2].name !== "Whiteley" ||
              retCts.values[3].name !== "Brown") {
          return Promise.reject(new Error("Query Contacts failed"));
        }
        await this._sqlite.closeNCConnection(databasePath);
        return Promise.resolve();

      } else {
        return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
