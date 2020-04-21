import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReadImageService {

    constructor() { }
    async base64StringFromBlob(file: File): Promise<string | ArrayBuffer> {
        return new Promise((resolve) => {
            // Only process image files.
            if (!file.type.match('image/*')) {
                resolve("");
            }
            /*
            file.arrayBuffer().then((buffer) => {
                let base64String: string = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`;  
                resolve(base64String);
              });
            */
           const reader = new FileReader();
           reader.onload = () => {
                resolve(reader.result);
           }
           reader.onerror = error => {
               console.log('error ',error)
               resolve("");
           }
           reader.readAsDataURL(file);
        });  
    }
}
