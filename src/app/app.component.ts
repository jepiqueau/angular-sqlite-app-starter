import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DarkModeService } from './services/darkmode.service';
import { SQLiteService } from './services/sqlite.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private initPlugin: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _sqlite: SQLiteService,
    private darkMode: DarkModeService
  ) {
    // Deal with Dark Mode
    const prefersDark: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    this.darkMode.enableDarkTheme(prefersDark.matches);
    prefersDark.addListener(mediaQuery => this.darkMode.enableDarkTheme(mediaQuery.matches));

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this._sqlite.initializePlugin().then(ret => {
        this.initPlugin = ret;
        console.log(">>>> in App  this.initPlugin " + this.initPlugin)
      });
    });
  }
}
