import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite.service';

import { createSchemaBlobs } from '../utils/blobs-utils';
import { deleteDatabase } from '../utils/db-utils';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Buffer } from 'buffer';
import { Images } from '../utils/base64images';

@Component({
  selector: 'app-testblobs',
  templateUrl: 'testblobs.page.html',
  styleUrls: ['testblobs.page.scss']
})
export class TestBlobsPage implements AfterViewInit {
  detail: boolean = false;
  isNative: boolean;
  handlerPermissions: any;
  initPlugin: boolean = false;
  imageList: any = [];
  myText: string = "";

  constructor(private _sqlite: SQLiteService) {
                this.isNative = this._sqlite.native
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
      // initialize the connection
      let db: SQLiteDBConnection;
      const retCC = (await this._sqlite.checkConnectionsConsistency()).result;
      let isConn = (await this._sqlite.isConnection("testBlobs")).result;
      if(retCC && isConn) {
        db = await this._sqlite.retrieveConnection("testBlobs");
      } else {
        db = await this._sqlite
                  .createConnection("testBlobs", false, "no-encryption", 1);
      }

      // check if the databases exist
      // and delete it for multiple successive tests
      await deleteDatabase(db);

      // open db testBlobs
      await db.open();

      // create tables in db
      let ret: any = await db.execute(createSchemaBlobs);
      if (ret.changes.changes < 0) {
        return Promise.reject(new Error("Execute createSchema failed"));
      }


      // delete blobs if any from previous run
      let delBlobs = `DELETE FROM blobs;`;
      ret = await db.execute(delBlobs, false);

      // Test to set a text as Blob
      const textBuffer = Buffer.from('Hello, World!');
      const stmt = "INSERT INTO blobs (name, type, blob) VALUES( ?,?,?);";
      let values: any[] = ["test", "text", textBuffer];
      ret = await db.run(stmt, values);
      console.log(`&&& res: ${JSON.stringify(ret)}`);
      if(ret.changes.changes !== 1) {
        return Promise.reject(new Error("Blob text insert failed"));
      }
      const query = `SELECT name, type, blob FROM blobs WHERE id = ? ;`;
      let retQuery: any = await db.query(query,[ret.changes.lastId]);
      if(retQuery.values.length !==1 ) {
        return Promise.reject(new Error("Blob text query failed"));
      }
      if(retQuery.values[0].type !== "text") {
        return Promise.reject(new Error("Blob text query not return the right type"));
      }
      const retText = (Buffer.from(retQuery.values[0].blob)).toString();
      if(retText !== 'Hello, World!') {
        return Promise.reject(new Error("Blob text query not return 'Hello, World!'"));
      }
      this.myText = retText;

      // Test to set a PNG image as Blob
      let imagePath = "../../assets/images/SeaSunset.png";
      let imageId = await this.writeImage(db, stmt, imagePath, "Image1", "png");
      if( imageId !== 2) {
        return Promise.reject(new Error("Blob Image PNG failed"));
      }
      let imageUrl: string = await this.readImage(db, query, imageId);
      const image1EL: HTMLImageElement = document.querySelector('#image1');
      image1EL.src = imageUrl;

      // Test to set a JPEG image as Blob
      imagePath = "../../assets/images/carRace.jpeg";
      imageId = await this.writeImage(db, stmt, imagePath, "Image2", "jpeg");
      if( imageId !== 3) {
        return Promise.reject(new Error("Blob Image JPEG failed"));
      }
      imageUrl = await this.readImage(db, query, imageId);
      const image2EL: HTMLImageElement = document.querySelector('#image2');
      image2EL.src = imageUrl;

      // test to set a BASE64 image as Blob
      values = ["meowth", "base64", Images[0]];
      ret = await db.run(stmt, values);
      console.log(`&&& res: ${JSON.stringify(ret)}`);
      if(ret.changes.changes !== 1) {
        return Promise.reject(new Error("Blob base64 insert failed"));
      }
      retQuery = await db.query(query,[ret.changes.lastId]);
      if(retQuery.values.length !==1 ) {
        return Promise.reject(new Error("Blob base64 query failed"));
      }
      const image3EL: HTMLImageElement = document.querySelector('#image3');
      image3EL.src = retQuery.values[0].blob;

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
  private async writeImage(db: SQLiteDBConnection, stmt: string, imagePath: string, name: string, type: string) {
    const blob = await(await fetch(imagePath)).blob();
    const imageBuffer = Buffer.from(new Uint8Array(await blob.arrayBuffer()));
    const imgValues = [name,type, imageBuffer];
    const ret = await db.run(stmt, imgValues);
    if(ret.changes.changes !== 1) {
      return Promise.reject(new Error('WriteImage failed'))
    }
    console.log(`&&& res: ${JSON.stringify(ret)}`);
    return ret.changes.lastId;
  }
  private async readImage(db: SQLiteDBConnection, query: string, imageId: number) {
    const retQuery = await db.query(query, [imageId]);
    if(retQuery.values.length !==1 ) {
      return Promise.reject(new Error("Blob Image query failed"));
    }
    if(retQuery.values[0].blob.length <= 0) {
      return Promise.reject(new Error("Blob Image query blob length <= 0"));
    }
    const arr = new Uint8Array(retQuery.values[0].blob )
    var myBlob = new Blob( [ arr ], { type: retQuery.values[0].type } );
    const imageUrl: string = URL.createObjectURL( myBlob );
    return imageUrl;
  }

}
