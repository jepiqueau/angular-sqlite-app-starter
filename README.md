<p align="center"><br><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="128" height="128" /></p>

<h3 align="center">Ionic/Angular SQLite App Starter</h3>
<p align="center"><strong><code>angular-sqlite-app-starter</code></strong></p>
<p align="center">Ionic/Angular application demonstrating the use of the</p>
<p align="center"><strong><code>@capacitor-community/sqlite<code></strong></p>
<p align="center">plugin and can be use as an Ionic/Angular application starter</p>
<br>
<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2020?style=flat-square" />
  <a href="https://github.com/jepiqueau/angular-sqlite-app-starter"><img src="https://img.shields.io/github/license/jepiqueau/angular-sqlite-app-starter?style=flat-square" /></a>
  <a href="https://github.com/jepiqueau/angular-sqlite-app-starter"><img src="https://img.shields.io/github/package-json/v/jepiqueau/angular-sqlite-app-starter?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all%20contributors-1-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>

## Maintainers

| Maintainer        | GitHub                                    | Social |
| ----------------- | ----------------------------------------- | ------ |
| Quéau Jean Pierre | [jepiqueau](https://github.com/jepiqueau) |        |


## Installation

To start building your App using this Starter App, clone this repo to a new directory:

```bash
git clone https://github.com/jepiqueau/angular-sqlite-app-starter.git 
cd angular-sqlite-app-starter
git remote rm origin
```

 - then install it

```bash
npm install
```

 - then go to the building process

```bash
npm run build
npx cap update
npm run build
npx cap copy
npx cap copy web
```

the capacitor config parameters are:

```
"appId": "com.example.app.capacitor"
"appName": "angular-sqlite-app-starter"
```

### Building Web Code

The ```@capacitor-community/sqlite``` is not implemented for Web Browsers.
if you run

```bash
npx cap serve
```
you will get the following messages:
```
SQLite Plugin not available for Web Platform
```

### Building Native Project

#### IOS

```bash
npx cap open ios
```
Once Xcode launches, you can build your finally app binary through the standard Xcode workflow.

#### Android

```bash
npx cap open android
```
Once Android Studio launches, you can build your app through the standard Android Studio workflow.

### Test SQLite access

The ```@capacitor-community/sqlite``` test is accessible in the Tab2 of the Application by clicking on the SQLite test button.

The application uses a service class as a wrapper to the ```@capacitor-community/sqlite``` plugin 

### Resulting Output

```
Open Database successful
Execute Creation Tables successful
Execute Insert Users successful
Execute Insert Messages successful
Query Two Users successful
Query Two Messages successful
Create One User with sqlcmd and values successful
Create One User with sqlcmd successful
Query Four Users successful
Query Users age > 30 successful
Closing the database was successful
The test database was successful
The test to encrypt the database was successful
The test encrypted database was successful
The test wrong password was successful
The test new password was successful
The test new password database was successful
The set of tests was successful
```

At the end of the test, two databases should have been created and both are encrypted, 
 - for the first one the secret is ```sqlite secret```
 - for the second one the secret is ```sqlite new secret```

```
test-sqliteSQLite.db
test-encryptedSQLite.db
```

### Changing the 'secret' and 'new secret'

#### IOS

In Xcode, before building your app, 
 - Go to the ```Pods/Development Pods/CapacitorCommunitySqlite``` folder, 
 - Modify the ```secret``` and ```newsecret```strings in the GlobalSQLite.swift file.

#### Android

In Android Studio, before building your app,
 - Go to the ```capacitor-community-sqlite/java/com.getcapacitor.community.database.sqlite/cdssUtils```folder,
 - Modify the ```secret``` and ```newsecret```strings in the GlobalSQLite.java file.

### Angular Service

A Angular Service has been defined as a wrapper to the ```@capacitor-community/sqlite``` plugin.

```tsx
import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import * as CapacitorSQLPlugin from '@capacitor-community/sqlite';
const { CapacitorSQLite, Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  sqlite: any;
  isService: boolean = false;
  platform: string;
  constructor() {
  }
  /**
   * Plugin Initialization
   */
  async initializePlugin(): Promise<void> {
    const info = await Device.getInfo();
    this.platform = info.platform;
    if (this.platform === "ios" || this.platform === "android") {
      this.sqlite = CapacitorSQLite;
      this.isService = true;
      if(this.platform === "android") {
        try {
          await CapacitorSQLite.requestPermissions();
        } catch (e) {
          console.log("Error requesting permissions " + e);
          this.isService = false;
        }
      }
    } else if(this.platform === "electron") {
      this.sqlite = CapacitorSQLPlugin.CapacitorSQLiteElectron;
      this.isService = true;
    } else {
      this.sqlite = CapacitorSQLPlugin.CapacitorSQLite;
    }
  }
  /**
   * Get Echo 
   * @param value string 
   */
  async getEcho(value:string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.echo({value:"Hello from JEEP"});
    } else {
      return Promise.resolve("");
    }
  }
  /**
   * Open a Database
   * @param dbName string
   * @param _encrypted boolean optional 
   * @param _mode string optional
   */  
  async openDB(dbName:string,_encrypted?:boolean,_mode?:string): Promise<any> {
    if(this.isService) {
      const encrypted:boolean = _encrypted ? _encrypted : false;
      const mode: string = _mode ? _mode : "no-encryption";
      return await this.sqlite.open({database:dbName,encrypted:encrypted,mode:mode});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }
  }
  /**
   * Execute a set of Raw Statements
   * @param statements string 
   */
  async execute(statements:string): Promise<any> {
    if(this.isService && statements.length > 0) {
      return await this.sqlite.execute({statements:statements});
    } else {
      return Promise.resolve({changes:-1,message:"Service not started"});
    }
  }
  /**
   * Execute a Single Raw Statement
   * @param statement string
   */
  async run(statement:string,_values?:Array<any>): Promise<any> {
    if(this.isService && statement.length > 0) {
      const values: Array<any> = _values ? _values : [];
      return  await this.sqlite.run({statement:statement,values:values});
    } else {
      return Promise.resolve({changes:-1,message:"Service not started"});
    }
  }
  /**
   * Query a Single Raw Statement
   * @param statement string
   * @param values Array<string> optional
   */
  async query(statement:string,_values?:Array<string>): Promise<any> {
    const values: Array<any> = _values ? _values : [];
    if(this.isService && statement.length > 0) {
      return await this.sqlite.query({statement:statement,values:values});
    } else {
      return Promise.resolve({values:[],message:"Service not started"});
    }

  } 
  /**
   * Close the Database
   * @param dbName string
   */
  async close(dbName:string): Promise<any> {
    if(this.isService) {
      return await this.sqlite.close({database:dbName});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }
  }
  /**
   * Delete the Database file
   * @param dbName string
   */
  async deleteDB(dbName:string): Promise<any> {
    if(this.isService) {
      return await this.sqlite.deleteDatabase({database:dbName});
    } else {
      return Promise.resolve({result:false,message:"Service not started"});
    }
  }
}

```

## Starting an App from Scratch

The process described below follows the instructions provided in the [Capacitor Documentation](https://capacitor.ionicframework.com/docs/getting-started/with-ionic/)

### New Ionic/Angular Project

```bash
ionic start mySQLiteApp tabs --type=angular --capacitor
cd ./mySQLiteApp
``` 

### Initialize Capacitor

```bash
npx cap init mySQLiteApp com.example.app
```

Your App information [appName] [appId] can be whathever you would like. 
Here we choose for the example [mySQLiteApp] [com.example.app]

### Install @capacitor-community/sqlite plugin

```bash
npm install --save @capacitor-community/sqlite@latest
```

### Add an Angular Service

```bash
ng g service sqlite
```

In your favorite editor open the ```sqlite.services.ts``` file under the ```src/app```folder and input the code as described above

### Access the Angular Service in your App Angular Components

#### Import in your Angular Component

```ts
import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
```

#### Inject the SQLiteService in your Angular Component Constructor

```ts
  constructor(private _SQLiteService: SQLiteService) {
  }
```

#### Initialize CapacitorSQLite plugin

```ts
  async ngAfterViewInit() {
        // Initialize the CapacitorSQLite plugin
        await this._SQLiteService.initializePlugin();

    ...
  }
```

#### Usage of the CapacitorSQLite plugin in Angular Component Methods

```ts
async fooMethod(): Promise<void> {
    ...
    if(this._SQLiteService.isService) {
      // open the database
      let resOpen = await this._SQLiteService.openDB("fooDB"); 
      if(resOpen.result) {
            ...

            ...
      }

    } else {
        console.log('CapacitorSQLite Plugin: Initialization Failed');
    }
    ...
}
```

When the database is open, use the other methods provided by the Angular Service to execute, run, query SQLite raw statements

### Build your App

```bash
npm run build
```

### Add Platforms

```bash
npx cap add ios
npx cap add android
```

### Building and Syncing your App with Capacitor

```bash
npm run build
npx cap copy
npx cap copy web
```

### Open IDE to Build, Run and Deploy

#### IOS

```bash
npx cap open ios
```
Once Xcode launches, you can build your finally app binary through the standard Xcode workflow.

#### Android

```bash
npx cap open android
```

Once Android launches,

 - Edit the MainActivity.java and add the following import:

```java
import com.getcapacitor.community.database.sqlite.CapacitorSQLite;
```

 - Add the CapacitorSQLite declaration in the this.init method

```java
add(CapacitorSQLite.class);
```

 - you can then build your app through the standard Android Studio workflow.

#### Electron

In your application folder add the @capacitor-community/electron

```bash
npm i @capacitor-community/electron
npx cap add @capacitor-community/electron
```

In the Electron folder of your application

```bash
npm install --save sqlite3
npm install --save-dev @types/sqlite3
npm install --save-dev electron-rebuild
```

Modify the Electron package.json file by adding a script "postinstall"

```json
  "scripts": {
    "build": "tsc",
    "electron:start": "npm run build && electron ./",
    "electron:pack": "npm run build && electron-builder build --dir",
    "electron:build-windows": "npm run build && electron-builder build --windows",
    "electron:build-mac": "npm run build && electron-builder build --mac",
    "postinstall": "electron-rebuild -f -w sqlite3"
  },
```

Execute the postinstall script

```bash
npm run postinstall
```
Go back in the main folder of your application
Add a script in the index.html file of your application in the body tag

```html
<body>
  <app-root></app-root>
  <script>
      try {
        if (
          process &&
          typeof process.versions.electron === 'string' &&
          process.versions.hasOwnProperty('electron')
        ) {
          const sqlite3 = require('sqlite3');
          const fs = require('fs');
          const path = require('path');
          const homeDir = require('os').homedir();
          window.sqlite3 = sqlite3;
          window.fs = fs;
          window.path = path;
          window.appName = 'YOUR_APP_NAME';
          window.homeDir = homeDir;
        }
      } catch {
        console.log("process doesn't exists");
      }
  </script>
</body>
```
and then build the application

```bash
 npx cap update
 npm run build
 npx cap copy
 npx cap open electron
```

The datastores created are under **User/Databases/YOUR_APP_NAME/**

### When @capacitor-community/sqlite is updated

Follow this process:

```bash
npm install --save @capacitor-community/sqlite@latest
npx cap update
npm run build
npx cap copy
npx cap copy web
npx cap open ios
npx cap open android
npx cap open electron
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jepiqueau"><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="100px;" alt=""/><br /><sub><b>Jean Pierre Quéau</b></sub></a><br /><a href="https://github.com/jepiqueau/angular-sqlite-app-starter/commits?author=jepiqueau" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

