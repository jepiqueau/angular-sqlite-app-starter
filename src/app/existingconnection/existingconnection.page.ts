import { Component, AfterViewInit } from '@angular/core';
import { setUsers } from '../utils/no-encryption-utils';
import { createSchemaMessages, setMessages } from '../utils/encrypted-set-utils';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-existingconnection',
  templateUrl: 'existingconnection.page.html',
  styleUrls: ['existingconnection.page.scss']
})
export class ExistingconnectionPage implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {}

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
    console.log("%%%% in ExistingconnectionPage this._sqlite " + this._sqlite)
    try {
      let result: any = await this._sqlite.echo("Hello World");
      console.log(" from Echo " + result.value);
      
      // retrieve the connections
      const db = await this._sqlite.retrieveConnection("testNew")
      const db1 = await this._sqlite.retrieveConnection("testSet")

      // load setUsers in db
      var ret: any = await db.executeSet(setUsers);
      console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
      if (ret.changes.changes !== 3) {
        return Promise.reject(new Error("executeSet setUsers failed"));
      }
      // select all users in db
      ret = await db.query("SELECT * FROM users;");
      if(ret.values.length !== 7 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones" ||
                                    ret.values[2].name !== "Simpson" ||
                                    ret.values[3].name !== "Brown" ||
                                    ret.values[4].name !== "Jackson" ||
                                    ret.values[5].name !== "Kennedy" ||
                                    ret.values[6].name !== "Bush"
                                    ) {
        return  Promise.reject(new Error("Query 7 Users failed"));
      }
    
      // create table messages in db1
      ret = await db1.execute(createSchemaMessages);
      console.log('$$$ ret.changes.changes in db1 ' + ret.changes.changes)
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("execute createSchemaMessages failed"));
      }

      // load setMessages in db1
      ret = await db1.executeSet(setMessages);
      console.log('$$$ ret.changes.changes in db1 ' + ret.changes.changes)
      if (ret.changes.changes !== 3) {
        return Promise.reject(new Error("executeSet setMessages failed"));
      }
      // select all users in db
      ret = await db1.query("SELECT * FROM messages;");
      if(ret.values.length !== 3 || ret.values[0].title !== "message 1" ||
                                    ret.values[1].title !== "message 2" ||
                                    ret.values[2].title !== "message 3"
                                    ) {
        return Promise.reject(new Error("Query 3 Messages failed"));
      }

      // test retrieve all connections
      var retDict: Map<string, any> = await 
                            this._sqlite.retrieveAllConnections();
      if(!retDict.has("testNew") || retDict.get("testNew") != db) {
        return Promise.reject(new Error("retrieveAllConnections has TestNew failed"));
      }
      if(!retDict.has("testSet") || retDict.get("testSet") != db1) {
        return Promise.reject(new Error("retrieveAllConnections has TestSet failed"));
      }

      await this._sqlite.closeAllConnections();

      this._detailService.setExistingConnection(false);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }

  }

}
