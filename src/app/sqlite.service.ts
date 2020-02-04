import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { Plugins } from '@capacitor/core';
import * as PluginsLibrary from '@jeepq/capacitor';
const { CapacitorSQLite, Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  sqlite: any;
  isService: boolean = false;
  platform: string;
  constructor() {
  }
  /**
   * Plugin Initialization
   */
  async initializePlugin(): Promise<void> {
    const info = await Device.getInfo();
    this.platform = info.platform;
    if (this.platform === "ios" || this.platform === "android") {
      this.sqlite = CapacitorSQLite;
      this.isService = true;
    } else {
      this.sqlite = PluginsLibrary.CapacitorSQLite;
    }
  }
  /**
   * Get Echo 
   * @param value string 
   */
  getEcho(value:string): Observable<any> {
    if (this.isService) {
      return from( this.sqlite.echo({value:"Hello from JEEP"}));
    } else {
      return from(Promise.resolve(""));
    }
  }
  /**
   * Open a Database
   * @param dbName string
   * @param _encrypted boolean optional 
   * @param _mode string optional
   */  
  openDB(dbName:string,_encrypted?:boolean,_mode?:string): Observable<any> {
    if(this.isService) {
      const encrypted:boolean = _encrypted ? _encrypted : false;
      const mode: string = _mode ? _mode : "no-encryption";
      return from( this.sqlite.open({database:dbName,encrypted:encrypted,mode:mode}));
    } else {
      return from(Promise.resolve({result:false}));
    }
  }
  /**
   * Execute a set of Raw Statements
   * @param statements string 
   */
  execute(statements:string): Observable<any> {
    if(this.isService && statements.length > 0) {
      return from( this.sqlite.execute({statements:statements}));
    } else {
      return from(Promise.resolve({changes:0}));
    }
  }
  /**
   * Execute a Single Raw Statement
   * @param statement string
   */
  run(statement:string,_values?:Array<any>): Observable<any> {
    if(this.isService && statement.length > 0) {
      const values: Array<any> = _values ? _values : [];
      return from( this.sqlite.run({statement:statement,values:values}));
    } else {
      return from(Promise.resolve({changes:0}));
    }
  }
  /**
   * Query a Single Raw Statement
   * @param statement string
   * @param values Array<string> optional
   */
  query(statement:string,_values?:Array<string>): Observable<any> {
    const values: Array<any> = _values ? _values : [];
    if(this.isService && statement.length > 0) {
      return from( this.sqlite.query({statement:statement,values:values}));
    } else {
      return from(Promise.resolve({values:[]}));
    }

  } 
  /**
   * Close the Database
   * @param dbName string
   */
  close(dbName:string): Observable<any> {
    if(this.isService) {
      return from( this.sqlite.close({database:dbName}));
    } else {
      return from(Promise.resolve({result:false}));
    }
  }
  /**
   * Delete the Database file
   * @param dbName string
   */
  deleteDB(dbName:string): Observable<any> {
    if(this.isService) {
      return from( this.sqlite.deleteDatabase({database:dbName}));
    } else {
      return from(Promise.resolve({result:false}));
    }
  }
}
