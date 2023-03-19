import { Component, OnInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { Dialog } from '@capacitor/dialog';
import { mergeScan } from 'rxjs';

@Component({
  selector: 'app-testFromLocalDiskToStore',
  templateUrl: 'testFromLocalDiskToStore.page.html',
  styleUrls: ['testFromLocalDiskToStore.page.scss']
})
export class TestFromLocalDiskToStore implements OnInit {
  log: string = "";
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;
  pickEndedListener: any;
  saveEndedListener: any;

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
    const openDB = async (dbName: string ) => {
      try {
        let db = await this._sqlite.createConnection(dbName, false, "no-encryption", 1);
        if (db == null) throw new Error(`openDB: createConnection ${dbName} failed`);
        await db.open();
        // select all tables
        const ret = await db.getTableList();
        if(ret.values.length > 0) {
          for (const tableName of ret.values) {
          const retQuery = await db.query(`SELECT * FROM ${tableName};`);
          console.log(`*** table: ${tableName} ***`);
          console.log(`${JSON.stringify(retQuery.values)}`);
          }
        }
        // do some other stuff here

        // save the database to disk
        await this._sqlite.saveToLocalDisk(dbName);

      } catch(err) {
        const msg = err.message ? err.message : err;
        document.querySelector('.sql-allfailure').classList
        .remove('display');
        console.log(`$$$ openDB failed ${msg}`);
        await showAlert(msg);
      }
    }
    this.pickEndedListener = await this._sqlite.sqlitePlugin.addListener('sqlitePickDatabaseEndedEvent', async (info: any) => {
      if(info.db_name) {
        try {
          await openDB(info.db_name);
        } catch(err) {
          const msg = err.message ? err.message : err;
          document.querySelector('.sql-allfailure').classList
          .remove('display');
          console.log(`$$$ openDB failed ${msg}`);
          await showAlert(msg);
        }
      }
      if(info.message) {
        document.querySelector('.sql-allfailure').classList
        .remove('display');
        console.log(`$$$ runTest failed ${info.message}`);
        await showAlert(info.message);
      }
    });
    this.saveEndedListener = await this._sqlite.sqlitePlugin.addListener('sqliteSaveDatabaseToDiskEvent', async (info: any) => {
      if(info.db_name) {
        try {
          const dbName = info.db_name.split("SQLite.db")[0];
          // close the connection to the database
          await this._sqlite.closeConnection(dbName);
          document.querySelector('.sql-allsuccess').classList
          .remove('display');
          console.log("$$$ runTest was successful");
        } catch(err) {
          const msg = err.message ? err.message : err;
          document.querySelector('.sql-allfailure').classList
          .remove('display');
          console.log(`$$$ openDB failed ${msg}`);
          await showAlert(msg);
        }
      }
      if(info.message) {
        document.querySelector('.sql-allfailure').classList
        .remove('display');
        console.log(`$$$ runTest failed ${info.message}`);
        await showAlert(info.message);
      }
    });
    try {
      await this.runTest();
    } catch (err) {
      const msg = err.message ? err.message : err;
      document.querySelector('.sql-allfailure').classList
        .remove('display');
      console.log(`$$$ runTest failed ${msg}`);
      await showAlert(msg);
    }
  }

  ngOnDestroy() {
    if( this.platform === 'web') {
      this.pickEndedListener.remove();
      this.saveEndedListener.remove();
    }
  }

  async runTest(): Promise<void> {
    this.log += "* Starting testFromLocalDiskToStore *\n";
    try {
      // *** test a db file ***
      await this._sqlite.getFromLocalDiskToStore(true);

    } catch (err) {
      const msg = err.message ? err.message : err;
      return Promise.reject(msg);
    }
  }
}
