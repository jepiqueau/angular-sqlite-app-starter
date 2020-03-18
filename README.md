# Ionic/Angular SQLite App Starter

Ionic/Angular application demonstrating the use of the ```capacitor-sqlite``` plugin and can be use as an Ionic/Angular application starter.


The ```capacitor-sqlite``` test is accessible in the Tab2 of the Application by clicking on the SQLite test button.

The application uses a service class as a wrapper to the ```capacitor-sqlite``` plugin 

## Getting Started

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

The ```capacitor-sqlite``` is not implemented for Web Browsers.
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

#### Resulting Output

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
 - Go to the ```Pods/Development Pods/CapacitorSqlite``` folder, 
 - Modify the ```secret``` and ```newsecret```strings in the GlobalSQLite.swift file.

#### Android

In Android Studio, before building your app,
 - Go to the ```capacitor-sqlite/java/com.jeep.plugins.capacitor/cdssUtils```folder,
 - Modify the ```secret``` and ```newsecret```strings in the GlobalSQLite.java file.

### Angular Service

A Angular Service has been defined as a wrapper to the ```capacitor-sqlite``` plugin.

```tsx
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { Plugins } from '@capacitor/core';
import * as PluginsLibrary from 'capacitor-sqlite';
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
    } else {
      this.sqlite = PluginsLibrary.CapacitorSQLite;
    }
  }
  /**
   * Get Echo 
   * @param value string 
   */
  getEcho(value:string): Observable<any> {
    if (this.isService) {
      return from( this.sqlite.echo({value:"Hello from JEEP"}));
    } else {
      return from(Promise.resolve(""));
    }
  }
  /**
   * Open a Database
   * @param dbName string
   * @param _encrypted boolean optional 
   * @param _mode string optional
   */  
  openDB(dbName:string,_encrypted?:boolean,_mode?:string): Observable<any> {
    if(this.isService) {
      const encrypted:boolean = _encrypted ? _encrypted : false;
      const mode: string = _mode ? _mode : "no-encryption";
      return from( this.sqlite.open({database:dbName,encrypted:encrypted,mode:mode}));
    } else {
      return from(Promise.resolve({result:false}));
    }
  }
  /**
   * Execute a set of Raw Statements
   * @param statements string 
   */
  execute(statements:string): Observable<any> {
    if(this.isService && statements.length > 0) {
      return from( this.sqlite.execute({statements:statements}));
    } else {
      return from(Promise.resolve({changes:0}));
    }
  }
  /**
   * Execute a Single Raw Statement
   * @param statement string
   */
  run(statement:string,_values?:Array<any>): Observable<any> {
    if(this.isService && statement.length > 0) {
      const values: Array<any> = _values ? _values : [];
      return from( this.sqlite.run({statement:statement,values:values}));
    } else {
      return from(Promise.resolve({changes:0}));
    }
  }
  /**
   * Query a Single Raw Statement
   * @param statement string
   * @param values Array<string> optional
   */
  query(statement:string,_values?:Array<string>): Observable<any> {
    const values: Array<any> = _values ? _values : [];
    if(this.isService && statement.length > 0) {
      return from( this.sqlite.query({statement:statement,values:values}));
    } else {
      return from(Promise.resolve({values:[]}));
    }

  } 
  /**
   * Close the Database
   * @param dbName string
   */
  close(dbName:string): Observable<any> {
    if(this.isService) {
      return from( this.sqlite.close({database:dbName}));
    } else {
      return from(Promise.resolve({result:false}));
    }
  }
  /**
   * Delete the Database file
   * @param dbName string
   */
  deleteDB(dbName:string): Observable<any> {
    if(this.isService) {
      return from( this.sqlite.deleteDatabase({database:dbName}));
    } else {
      return from(Promise.resolve({result:false}));
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

### Install capacitor-sqlite plugin

```bash
npm install --save capacitor-sqlite@latest
```

### Add an Angular Service

```bash
ng g service sqlite
```

In your favorite editor open the ```sqlite.services.ts``` file under the ```src/app```folder and input the code as described above

### Access the Angular Service in your App Angular Components

#### Import in your Angular Component

```ts
import { SQLiteService } from '../sqlite.service';
import { concatAll } from 'rxjs/operators';
import { Observable, concat} from 'rxjs';
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
      this._SQLiteService.openDB("fooDB") 
      .subscribe(result => {
        if(result.result) {
            ...

            ...
        }
      }),

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
import com.jeep.plugin.capacitor.CapacitorSQLite;
```

 - Add the CapacitorSQLite declaration in the this.init method

```java
add(CapacitorSQLite.class);
```

 - you can then build your app through the standard Android Studio workflow.


### When capacitor-sqlite is updated

Follow this process:

```bash
npm install --save capacitor-sqlite@latest
npx cap update
npm run build
npx cap copy
npx cap copy web
npx cap open ios
npx cap open android
```

