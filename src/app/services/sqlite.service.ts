import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import '@capacitor-community/sqlite';
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
    console.log("*** platform " + this.platform)
    this.sqlite = CapacitorSQLite;
    this.isService = true;

    if(this.platform === "android") {
      try {
        await this.sqlite.requestPermissions();
      } catch (e) {
        console.log("Error requesting permissions " + e);
        this.isService = false;
      }
    }
 
  }
  /**
   * Get Echo 
   * @param value string 
   */
  async getEcho(value:string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.echo({value:"Hello from JEEP"});
    } else {
      return Promise.resolve("");
    }
  }
  /**
   * Open a Database
   * @param dbName string
   * @param _encrypted boolean optional 
   * @param _mode string optional
   */  
  async openDB(dbName:string,_encrypted?:boolean,_mode?:string,
               _version?:number): Promise<any> {
    if(this.isService) {
      const encrypted:boolean = _encrypted ? _encrypted : false;
      const mode: string = _mode ? _mode : "no-encryption";
      const version: number = _version ? _version : 1;
      return await this.sqlite.open({database:dbName,encrypted:encrypted,
                                     mode:mode,version:version});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }
  }
  async createSyncTable(): Promise<any> {
    if(this.isService) {
      return await this.sqlite.createSyncTable();
    } else {
      return Promise.resolve({changes:-1,message:"Service not started"});
    }
  }
  /**
   * Execute a set of Raw Statements
   * @param statements string 
   */
  async execute(statements:string): Promise<any> {
    if(this.isService && statements.length > 0) {
      return await this.sqlite.execute({statements:statements});
    } else {
      return Promise.resolve({changes:-1,message:"Service not started"});
    }
  }
  /**
   * Execute a set of Raw Statements as Array<any>
   * @param set Array<any> 
   */
  async executeSet(set:Array<any>): Promise<any> {
    if(this.isService && set.length > 0) {
      return await this.sqlite.executeSet({set:set});
    } else {
      return Promise.resolve({changes:-1,message:"Service not started"});
    }
  }
  /**
   * Execute a Single Raw Statement
   * @param statement string
   */
  async run(statement:string,_values?:Array<any>): Promise<any> {
    if(this.isService && statement.length > 0) {
      const values: Array<any> = _values ? _values : [];
      return  await this.sqlite.run({statement:statement,values:values});
    } else {
      return Promise.resolve({changes:-1,message:"Service not started"});
    }
  }
  /**
   * Query a Single Raw Statement
   * @param statement string
   * @param values Array<string> optional
   */
  async query(statement:string,_values?:Array<string>): Promise<any> {
    const values: Array<any> = _values ? _values : [];
    if(this.isService && statement.length > 0) {
      return await this.sqlite.query({statement:statement,values:values});
    } else {
      return Promise.resolve({values:[],message:"Service not started"});
    }

  } 
  /**
   * Close the Database
   * @param dbName string
   */
  async close(dbName:string): Promise<any> {
    if(this.isService) {
      return await this.sqlite.close({database:dbName});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }
  }
  /**
   * Check if the Database file exists
   * @param dbName string
   */
  async isDBExists(dbName:string): Promise<any> {
    if(this.isService) {
      return await this.sqlite.isDBExists({database:dbName});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }
  }
  /**
   * Delete the Database file
   * @param dbName string
   */
  async deleteDB(dbName:string): Promise<any> {
    if(this.isService) {
      return await this.sqlite.deleteDatabase({database:dbName});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }
  }
  /**
   * Check the validity of a JSON Object
   * @param jsonstring string 
   */
  async isJsonValid(jsonstring:string): Promise<any> {
    if(this.isService ) {
      console.log('jsonObject ', jsonstring)
      return await this.sqlite.isJsonValid({jsonstring:jsonstring});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }
  }

  /**
   * Import a database From a JSON
   * @param jsonstring string 
   */
  async importFromJson(jsonstring:string): Promise<any> {
    if(this.isService ) {
      console.log('jsonObject ', jsonstring)
      return await this.sqlite.importFromJson({jsonstring:jsonstring});
    } else {
      return Promise.resolve({changes:-1,message:"Service not started"});
    }
  }
  /**
   * Export the given database to a JSON Object
   * @param dbName 
   * @param encrypted 
   * @param mode 
   */
  async exportToJson(mode:string): Promise<any> {
    if(this.isService ) {
      return await this.sqlite.exportToJson({jsonexportmode:mode});
    } else {
      return Promise.resolve({export:{},message:"Service not started"});
    }    
  }
  async setSyncDate(syncDate: string): Promise<any> {
    if(this.isService ) {
      return await this.sqlite.setSyncDate({syncdate:syncDate});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }    

  }
  async addUpgradeStatement(database: string, upgrade: any): Promise<any> {
    if(this.isService ) {
      return await this.sqlite.addUpgradeStatement({database:database,
                                                    upgrade:upgrade});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }    
  }
}
