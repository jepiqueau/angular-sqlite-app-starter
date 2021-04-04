import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpClient} from "@angular/common/http";

import { Plugins, Capacitor } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
         capSQLiteChanges, capEchoResult, capSQLiteResult, 
         capSQLiteValues, JsonSQLite} from '@capacitor-community/sqlite';
const { CapacitorSQLite, Storage } = Plugins;

const DB_SETUP_KEY = "first_db_setup";
const DB_NAME_KEY = "db_name";
         

@Injectable({
    providedIn: 'root',
})


export class StorageService {
    dbReady = new BehaviorSubject(false);
    dbName = "";
    sqlite: SQLiteConnection;
    db: SQLiteDBConnection;
    isService: boolean = false;
    platform: string;
  
    constructor(private http: HttpClient) {}
  
  initializePlugin(): Promise<boolean> {
      console.log('starting sqlite initialization...');
      return new Promise((resolve) => {
        this.platform = Capacitor.platform;
        console.log("*** platform " + this.platform);
        const sqlitePlugin: any = CapacitorSQLite;
        this.sqlite = new SQLiteConnection(sqlitePlugin);
        this.isService = true;
        console.log("$$$ in service this.isService " + this.isService + " $$$");
        this.setupDatabase();
        resolve(true);
      });
    }
    /**
     * Echo a value
     * @param value
     */
    async echo(value: string): Promise<capEchoResult> {
      console.log("&&&& in echo this.sqlite " + this.sqlite + " &&&&");
      if (this.sqlite != null) {
        return await this.sqlite.echo(value);
      } else {
        return null;
      }
    }
  
    private async setupDatabase() {
      console.log('setting up database');
      const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });
      if (!dbSetupDone.value) {
        this.downloadDatabase();
      } else {
        this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
        let db = await this.createConnection();
            if (db) {
            this.dbReady.next(true);
            }
        }
    }
  
    private async createConnection(): Promise<SQLiteDBConnection | null> {
      console.log('setting up db connection');
      if (this.sqlite != null) {
        this.db = await this.sqlite.createConnection(
          this.dbName,
          false,
          "no-encryption",
          1
        );
        console.log(this.db);
        if (this.db != null) {
          this.db.open();
          return this.db;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  
    private downloadDatabase(update = false) {
      console.log('downloading database');
      this.http
        .get("../../assets/start_db.json")
        .subscribe(async (jsonExport: JsonSQLite) => {
          const jsonstring = JSON.stringify(jsonExport);
          let isValid = false;
          try {
            const isValidTry = await CapacitorSQLite.isJsonValid({ jsonstring });
            console.log(isValidTry)
            isValid = isValidTry.result;
          } catch (e) {
            console.error(e);
          }
          console.log(isValid);
          if (isValid) {
            console.log('dbjson is valid');
            this.dbName = jsonExport.database;
            try {
              await Storage.set({ key: DB_NAME_KEY, value: this.dbName });
              await this.sqlite.importFromJson(jsonstring);
              await Storage.set({ key: DB_SETUP_KEY, value: "1" });
            } catch (e) {
              console.error(e);
            }
            console.log('db set');
            // Your potential logic to detect offline changes later
            let db = await this.createConnection();
            if (db) {
              this.dbReady.next(true);
              if (!update) {
                await db.createSyncTable();
              } else {
                await db.setSyncDate("" + new Date().getTime());
              }
            }
          }
        });
    }
}