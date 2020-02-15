import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  constructor() { }
  public enableDarkTheme(shouldEnable:boolean) {
    document.body.classList.toggle("dark",shouldEnable);
  }
}
