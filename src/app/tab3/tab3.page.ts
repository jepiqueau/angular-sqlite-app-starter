import { Component } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private darkMode: DarkModeService) {
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      console.log('🎉 Dark mode is supported');
    }
  }
  enableDarkTheme(mode:boolean) {
    this.darkMode.enableDarkTheme(mode);
  }
}
