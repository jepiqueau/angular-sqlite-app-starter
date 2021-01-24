import { Injectable } from '@angular/core';

import { Plugins, Capacitor } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
         capSQLiteChanges, capEchoResult, capSQLiteResult 
        } from '@capacitor-community/sqlite';
const { CapacitorSQLite } = Plugins;

@Injectable()

export class SQLiteService {
    sqlite: SQLiteConnection;
    isService: boolean = false;
    platform: string;

    constructor() {
    }
    /**
     * Plugin Initialization
     */
    initializePlugin(): Promise<boolean> {
        return new Promise (resolve => {
            this.platform = Capacitor.platform;
            console.log("*** platform " + this.platform)
            const sqlitePlugin: any = CapacitorSQLite;
            this.sqlite = new SQLiteConnection(sqlitePlugin);
            this.isService = true;
            console.log("$$$ in service this.isService " + this.isService + " $$$")
            resolve(true);
        });
    }
    /**
     * Echo a value
     * @param value 
     */
    async echo(value: string): Promise<capEchoResult> {
        console.log("&&&& in echo this.sqlite " + this.sqlite + " &&&&")
        if(this.sqlite != null) {
            return await this.sqlite.echo(value);
        } else {
            return null;
        }
    }
    /**
     * addUpgradeStatement
     * @param database 
     * @param fromVersion 
     * @param toVersion 
     * @param statement 
     * @param set 
     */
    async addUpgradeStatement(database:string, fromVersion: number,
                              toVersion: number, statement: string,
                              set?: capSQLiteSet[])
                                        : Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            return await this.sqlite.addUpgradeStatement(database,
                fromVersion, toVersion, statement, set ? set : []);
        } else {
            return null;
        }                             
    }
    /**
     * Create a connection to a database
     * @param database 
     * @param encrypted 
     * @param mode 
     * @param version 
     */
    async createConnection(database:string, encrypted: boolean,
                           mode: string, version: number
                           ): Promise<SQLiteDBConnection | null> {
        if(this.sqlite != null) {
            const db: SQLiteDBConnection = await this.sqlite.createConnection(
                                database, encrypted, mode, version);
            if (db != null) {
                return db;
            } else {
                return null
            }
        } else {
            return null;
        }
    }
    /**
     * Close a connection to a database
     * @param database 
     */
    async closeConnection(database:string): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            return await this.sqlite.closeConnection(database);
        } else {
            return null;
        }
    }
    /**
     * Retrieve an existing connection to a database
     * @param database 
     */
    async retrieveConnection(database:string): 
            Promise<SQLiteDBConnection | null | undefined> {
        if(this.sqlite != null) {
            return await this.sqlite.retrieveConnection(database);
        } else {
            return null;
        }
    }
    /**
     * Retrieve all existing connections
     */
    async retrieveAllConnections(): 
                    Promise<Map<string, SQLiteDBConnection>> {
        if(this.sqlite != null) {
            const myConns =  await this.sqlite.retrieveAllConnections();
            let keys = [...myConns.keys()];
            keys.forEach( (value) => {
                console.log("Connection: " + value);
              }); 
              return myConns;
        } else {
            return null;
        }               
    }
    /**
     * Close all existing connections
     */
    async closeAllConnections(): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            return await this.sqlite.closeAllConnections();
        } else {
            return null;
        }
    }
    /**
     * Import from a Json Object
     * @param jsonstring 
     */
    async importFromJson(jsonstring:string): Promise<capSQLiteChanges> {
        if(this.sqlite != null) {
            return await this.sqlite
                                .importFromJson(jsonstring);
        } else {
            return null;
        }
                    
    }
    /**
     * Is Json Object Valid
     * @param jsonstring Check the validity of a given Json Object
     */
    async isJsonValid(jsonstring:string): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            return await this.sqlite.isJsonValid(jsonstring);
        } else {
            return null;
        }

    }
    /**
     * Copy databases from public/assets/databases folder to application databases folder
     */
    async copyFromAssets(): Promise<capSQLiteResult> { 
        if (this.sqlite != null) {
          return await this.sqlite.copyFromAssets();
        } else {
          return null;
        }
      }
    
}
