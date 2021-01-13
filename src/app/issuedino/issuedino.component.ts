import { Component } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { firstImport, secondImport } from '../utils/dino-utils';
@Component({
  selector: 'app-issuedino',
  templateUrl: './issuedino.component.html',
  styleUrls: ['./issueDino.component.scss'],
})
export class IssueDinoComponent {
  platform: string;
  issueDino: boolean = false;
  initTest:boolean = false;
  initPlugin: boolean = false;
  retImport1: boolean = false;
  retImport2: boolean = false;

  constructor(private _SQLiteService: SQLiteService) {
    console.log(`isService ${this._SQLiteService.isService}`);
    this.initPlugin = this._SQLiteService.isService;
  }
  /*******************************
  * Component Methods           *
  *******************************/

  async runTests(): Promise<void> {
    console.log("****** entering run tests");
    // In case of multiple test runs
    this.resetDOM();
    // Start Running the Set of Tests
    const cardSQLite = document.querySelector('.card-issueDino');
    if(cardSQLite && cardSQLite.classList.contains("hidden")) 
              cardSQLite.classList.remove('hidden');
    if(this.initPlugin) {
      this.initTest = await this.testInitialization();
      if (this.initTest) {
        // Create a Database with No-Encryption
        this.issueDino = await this.testIssueDino();
        if(!this.issueDino) {     
          document.querySelector('.sql-failure-issueDino').classList
                  .remove('display');
        } else {
          console.log("***** End testDatabase *****");
          document.querySelector('.sql-success-issueDino').classList
                  .remove('display');
        }
      }
    }
  }
  /**
  * Reset the DOM
  */
  async resetDOM(): Promise<void> {
    const cardSQLite = document.querySelector('.card-issueDino');
    if(cardSQLite) {
      if (!cardSQLite.classList.contains("hidden")) cardSQLite.classList.add('hidden');
      for (let i:number=0;i< cardSQLite.childElementCount;i++) {
        if(!cardSQLite.children[i].classList.contains('display')) cardSQLite.children[i].classList.add('display');
      }
    }
  }

  /**
   * testInitialization
   */
  async testInitialization(): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.retImport1 = false;
      this.retImport2 = false;
         
      const echo = await this._SQLiteService.getEcho("Hello from JEEP");
      console.log("*** echo ",echo);
      if(echo.value === "Hello from JEEP") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
  /**
  * Test IssueDino database
  */
  async testIssueDino(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // check if the database logbookdirector exists 
      let result: any = await this._SQLiteService.isDBExists("logbookdirector");
      console.log("isDBExists 'logbookdirector' " + JSON.stringify(result));
      if(result.result) {
          // open the DB
          let resOpen = await this._SQLiteService.openDB("logbookdirector"); 
          if(resOpen.result) {
            let resDel: any = await this._SQLiteService.deleteDB("logbookdirector");
            if(!resDel.result) {
              console.log("Error in deleting the database logbookdirector");
              resolve(false);
            }
          }
      } else {
        console.log("*** database logbookdirector does not exist");
      }
          
      //  First Import
      console.log("$$$ Start First Import a JSON Object");
      result = await this._SQLiteService
                .importFromJson(JSON.stringify(firstImport));    
      console.log('first import result ',result)
      this.retImport1 = result.changes.changes >0 ? true : false;
      if(this.retImport1) document.querySelector('.import-1-issueDino').classList.remove('display');

      //  Second Import
      console.log("$$$ Start Second Import a JSON Object");
      result = await this._SQLiteService
                .importFromJson(JSON.stringify(secondImport));    
      console.log('second import result ',result)
      this.retImport2 = result.changes.changes >0 ? true : false;
      if(this.retImport1) document.querySelector('.import-2-issueDino').classList.remove('display');
      
      let ret = false;
      if(this.retImport1 && this.retImport2) ret = true;
      console.log(`$$$ before ending test issue#Dino '${ret}'`);
      resolve(ret);
    });
  }

}
