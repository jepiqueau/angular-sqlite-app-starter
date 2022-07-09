import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { DetailService } from '../../services/detail.service';
import { schemaToImport237, contactsToImportPartial237, messagesToImportPartial237, schemaToImport240 } from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson237',
  templateUrl: 'testjson237.page.html',
  styleUrls: ['testjson237.page.scss']
})
export class Testjson237Page implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
    const showAlert = async (message: string) => {
      await Dialog.alert({
      title: 'Error Dialog',
      message: message,
      });
    };
    try{
      await this.runTest();
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } catch (err) {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log("$$$ runTest failed");
      await showAlert(err.message);
    }
  }


  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");

      // ************************************************
      // Import Json Object Issue#231
      // ************************************************
      // test Full Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(schemaToImport237));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid Full failed"));
      }
      // full import create schema only
      result = await this._sqlite
                          .importFromJson(JSON.stringify(schemaToImport237));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson 'full' failed"));
      // test Partial contacts Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(contactsToImportPartial237));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid Contacts Partial failed"));
      }
      // partial import load the data
      result = await this._sqlite
                          .importFromJson(JSON.stringify(contactsToImportPartial237));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson Contacts 'partial' failed"));

      // test Partial messages Json object validity
      result = await this._sqlite
      .isJsonValid(JSON.stringify(messagesToImportPartial237));
      if(!result.result) {
      return Promise.reject(new Error("IsJsonValid Messages Partial failed"));
      }
      // partial import load the data
      result = await this._sqlite
                .importFromJson(JSON.stringify(messagesToImportPartial237));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson Messages 'partial' failed"));

      // create the connection to the database
      const db = await this._sqlite
                        .createConnection("test_issue237", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection test_issue237 failed"));

      // open db test_issue237
      await db.open();

      // select all contacts in db
      let ret: any = await db.query("SELECT * FROM contacts;");
      if(ret.values.length !== 4 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones"||
                                    ret.values[2].name !== "Simpson"||
                                    ret.values[3].name !== "Brown") {
        return Promise.reject(new Error("Query contacts failed"));
      }
      // select all messages in db
      ret = await db.query("SELECT * FROM messages;");
      if(ret.values.length !== 2 || ret.values[0]["title"] !== "test post 1" ||
                                    ret.values[1]["title"] !== "test post 2") {
        return Promise.reject(new Error("Query messages failed"));
      }
      // ************************************************
      // Export Json Object from an Existing Database
      // ************************************************


/*
      // export json full
      let jsonObj: any = await db.exportToJson('full');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }

      // export json partial
/*      jsonObj = await db.exportToJson('partial');
    
      // test Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(jsonObj.export));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'partial' failed"));
      }
*/
      // close the connection
      const is237Con = (await this._sqlite.isConnection("test_issue237")).result;
      if (is237Con) await this._sqlite.closeConnection("test_issue237");

      // ************************************************
      // Import Json Object Issue#240
      // ************************************************
      // test Full Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(schemaToImport240));
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid #240 Full failed"));
      }
      // full import create schema only
      result = await this._sqlite
                          .importFromJson(JSON.stringify(schemaToImport240));    
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson #240 'full' failed"));
      // create the connection to the database
      const db1 = await this._sqlite
                        .createConnection("test_issue240", false,
                                          "no-encryption", 1);
      if(db1 === null) return Promise.reject(new Error("CreateConnection test_issue240 failed"));

      // open db test_issue240
      await db1.open();

      const insertStmt = `INSERT INTO task_list (delivers,reads,status,files,_id,title,du,cid,assignee,oid,type,createAt,updateAt,cInfo,last,category) VALUES ('[]','[]','progress','[]','60857f2bd04e5800ce4720b7','test group updat','2021-04-25T14:39:20.220Z','60616972bf1ab71fef2926eb',9122223,912222208,'task','2021-04-25T14:39:39.779Z','2021-10-19T11:08:50.271Z','{"912228":0,"9192226":9,"912222233":0}','{"sender":91222273,"msg":"here"}','Work') ON CONFLICT (_id) DO UPDATE SET delivers='[]',reads='[]',status='progress',files='[]',_id='60857f2bd04e5800ce4720b7',title='test group updat',du='2021-04-25T14:39:20.220Z',cid='60616972bf1ab71fef2926eb',assignee=912222273,oid=918056598408,type='task',createAt='2021-04-25T14:39:39.779Z',updateAt='2021-10-19T11:08:50.271Z',cInfo='{"912222280":0,"9122222216":9,"918012430333":0}',last='{"sender":912222273,"msg":"here"}',category='Work' `;
      ret = await db1.run(insertStmt);

      const queryStmt = `SELECT * From task_list WHERE status != 'closed' order by updateAt desc limit 10 offset 0`;
      ret = await db1.query(queryStmt);
      const is240Con = (await this._sqlite.isConnection("test_issue240")).result;
      // close the connection
      await this._sqlite.closeConnection("test_issue240"); 
 
      return Promise.resolve();
    } catch (err) {
     // close the connection
     const is237Con = (await this._sqlite.isConnection("test_issue237")).result;
     if(is237Con) await this._sqlite.closeConnection("test_issue237"); 
     const is240Con = (await this._sqlite.isConnection("test_issue240")).result;
     if(is240Con) await this._sqlite.closeConnection("test_issue240");
     console.log(`Error: ${err}`) 
     return Promise.reject(err);
    }
  

  }

}
