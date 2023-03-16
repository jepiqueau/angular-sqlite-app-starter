import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';
import { testIssue385} from '../utils/import-json-utils';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-testjson385',
  templateUrl: 'testjson385.page.html',
  styleUrls: ['testjson385.page.scss']
})
export class Testjson385Page implements AfterViewInit {
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
      let msg: string = err.message ? err.message : err;
      await showAlert(msg);
      console.log(`$$$ runTest failed ${msg}`);
    }
  }


  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");

      // ************************************************
      // Import Json Object Issue#385
      // ************************************************
      // test Full Json object validity
      result = await this._sqlite
                            .isJsonValid(JSON.stringify(testIssue385));
      console.log(`isJsonValid ${result.result} `)
      if(!result.result) {
        return Promise.reject(new Error("IsJsonValid testIssue385 Full failed"));
      }
      // full import
      result = await this._sqlite
                          .importFromJson(JSON.stringify(testIssue385));
      console.log(`importFromJson ${JSON.stringify(result)} `)
      if(result.changes.changes === -1 ) return Promise.reject(new Error("ImportFromJson V1 'full' failed"));
      console.log(`>>> Import testIssue385 changes: ${result.changes.changes}`);

      // ************************************************
      // Create the connection to the database
      // ************************************************
      let db = await this._sqlite
                        .createConnection("db_issue385", false,
                                          "no-encryption", 1);
      if(db === null) return Promise.reject(new Error("CreateConnection db-issue385 failed"));

      // open db db-issue385
      await db.open();
      const isDB = await db.isDBOpen();
      if(!isDB) return Promise.reject('Database "db_issue385" not opened');
      const ret = await db.getTableList();
      console.log(`Table list: ${JSON.stringify(ret)}`);

      // ************************************************
      // Fill some data
      // ************************************************
      const res = await db.execute( `
        INSERT INTO departments VALUES (1,'IT'),(2,'Mechanical'),(3,'Arts'),(4,'Artificial Intelligence');
        INSERT INTO students VALUES (1,'John',1),(2,'Thomas',2),(3,'Steven',1),(4,'Michael',3),(5,'Julia',4);
      `);
      console.log(`after insert: ${JSON.stringify(res)}`)
      await this.showDepartments(db,'initial data')
      await this.showStudents(db,'initial data')

      // Delete an employee
      await this.deleteStudentByName(db,'Michael');
      // Show after delete a student data
      await this.showDepartments(db,'after Michael delete');
      await this.showStudents(db,'after Michael delete');
      await this.deleteDepartmentByName(db,'IT');
      // Show after delete a department data
      await this.showDepartments(db,'after IT delete');
      await this.showStudents(db,'after IT delete');

      // close the connection
      await this._sqlite.closeConnection("db_issue385");
      return Promise.resolve();
    } catch (err) {
      // close the connection
      const isConn = (await this._sqlite.isConnection("db_issue385")).result;
      if(isConn) await this._sqlite.closeConnection("db_issue385");
      return Promise.reject(err);
    }


  }
  showDepartments = async (db:SQLiteDBConnection, message:string) => {
    try {
      let res = await db.query('SELECT * FROM departments');
      console.log(`\n**** Departments ${message} ****`)
      console.log(`res: ${JSON.stringify(res)}`)
/*          for( const row of res.values) {
        console.log(`>>> col1: ${row.col1} col2: ${row.col2} col3: ${row.col3} sql_deleted: ${row.sql_deleted}`);
      }
*/
    } catch(err) {
        return Promise.reject(err);
    }
  }
  showStudents = async (db:SQLiteDBConnection, message:string) => {
    try {
      let res = await db.query('SELECT * FROM students');
      console.log(`\n**** Students ${message} ****`)
      console.log(`res: ${JSON.stringify(res)}`)
/*          for( const row of res.values) {
        console.log(`>>> id: ${row.id} name: ${row.name} sql_deleted: ${row.sql_deleted}`);
      }
*/
    } catch(err) {
        return Promise.reject(err);
    }
  }
  deleteStudentByName = async (db:SQLiteDBConnection, name:string) => {
    const stmt = `DELETE FROM students WHERE student_name = ?`;
    const ret = await db.run(stmt, [name]);
    console.log(`deleteStudentByName ret: ${JSON.stringify(ret)}`);
  }
  deleteDepartmentByName = async (db:SQLiteDBConnection, name:string) => {
    const stmt = `DELETE FROM departments WHERE department_name = ?`;
    const ret = await db.run(stmt, [name]);
    console.log(`deleteStudentByName ret: ${JSON.stringify(ret)}`);
  }

}
