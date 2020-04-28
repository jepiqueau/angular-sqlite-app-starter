import { Component, AfterViewInit} from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';
import { SQLiteService } from '../services/sqlite.service';
import { ReadImageService } from '../services/read-images.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements AfterViewInit{

  constructor(private darkMode: DarkModeService ,
        private _SQLiteService: SQLiteService ,
        private _ImageService: ReadImageService) {
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      console.log('🎉 Dark mode is supported');
    }
  }
  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    const card1El = document.querySelector("#card-static-images");    
    const card2El = document.querySelector("#card-input-file"); 
    const inputFile = card2El.querySelector("#inputFile") ;
    console.log("inputFile ",inputFile)
  
    inputFile.addEventListener('change', this.handleFileSelect.bind(this), false);
    await this._SQLiteService.initializePlugin();
    // open the database
    let result:any = await this._SQLiteService.openDB("db-from-json"); 
    if(result.result) {
      const conEl = card1El.querySelector("#image-static-from-db");
      // Select the meowth image
      let sqlcmd: string = "SELECT name,img FROM images WHERE name = 'meowth';";
      result = await this._SQLiteService.query(sqlcmd);
      if(result.values.length === 1) {
        this.renderImage(conEl,result.values[0].img);
      }
      // Select the feather image
      sqlcmd = "SELECT name,img FROM images WHERE name = 'feather';";
      result = await this._SQLiteService.query(sqlcmd);
      if(result.values.length === 1) {
        this.renderImage(conEl,result.values[0].img);
      }
      // delete the images for id> 2
      sqlcmd = "DELETE FROM images WHERE id > 2;" 
      await this._SQLiteService.run(sqlcmd,[]);           
      
      await this._SQLiteService.close("db-from-json");
    }
  }
  enableDarkTheme(mode:boolean) {
    this.darkMode.enableDarkTheme(mode);
  }
  async handleFileSelect(evt) {
    const file: File = evt.target.files[0];
    console.log('getFile.name ',file.name)
    console.log('getFile.type ',file.type)
    console.log('getFile.size ',file.size)
    if (file.type.match('image/*')) {

      const card2El = document.querySelector("#card-input-file"); 
      const conEl = card2El.querySelector("#image-from-db");
      let result:any = await this._SQLiteService.openDB("db-from-json"); 
      if(result.result) {
        // upload image to db 

        let sqlcmd: string= "INSERT INTO images (name,type,size,img,last_modified) VALUES (?,?,?,?,?)";
        const imgDate = Math.round((new Date()).getTime() / 1000);
        const fsize: number = Math.round(file.size/1024);
        console.log('fsize ',fsize)
        const imgBase64:any = await this._ImageService.base64StringFromBlob(file);
        if(imgBase64 && imgBase64.length > 0) {
          let imgvalues: Array<any>  = [file.name.split(".")[0],file.type.split("/")[1],
          fsize,imgBase64,imgDate];
          const resRun = await this._SQLiteService.run(sqlcmd,imgvalues);
          if(resRun.changes.changes === 1) {
            // read image from db
            let sqlcmd: string = `SELECT name,size,img FROM images WHERE name = '${file.name.split(".")[0]}';`;
            const result1 = await this._SQLiteService.query(sqlcmd);
            if(result1.values.length === 1) {
              console.log('result1.values[0].size ',result1.values[0].size)
              // plot the image
              this.renderImage(conEl,result1.values[0].img,result1.values[0].size);
            }
          }
        }
        await this._SQLiteService.close("db-from-json");
      }  
    }

  }
  renderImage(conEl: Element,img: string, size?: any) {
    const divEl = document.createElement("div");
    divEl.setAttribute("id","image")
    const imgEl = document.createElement("img");
    imgEl.src = img;
    imgEl.width = 150;
    imgEl.height = 150;
    divEl.appendChild(imgEl);
    const imgsize: string = size ? size.toString() : ""; 
    if(imgsize.length > 0) {
      const pEl = document.createElement("p");
      const metaText = "Filesize: " + imgsize + " KB";
      pEl.textContent = metaText;
      divEl.appendChild(pEl);
    }
    conEl.appendChild(divEl);
  }

}
