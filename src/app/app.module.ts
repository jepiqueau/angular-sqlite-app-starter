import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SQLiteService } from './services/sqlite.service';
import { DetailService } from './services/detail.service';
import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    SQLiteService,
    DetailService,
    StorageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
