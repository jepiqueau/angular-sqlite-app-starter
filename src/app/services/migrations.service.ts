import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatabaseService } from './database.service';
import { SQLiteService } from './sqlite.service';

export const createSchemaProducts: string = `
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMBER NOT NULL,
  imageUrl TEXT DEFAULT '',
  isAvailable BOOLEAN NOT NULL CHECK (isAvailable IN (0, 1)),
  isPopular BOOLEAN NOT NULL CHECK (isAvailable IN (0, 1)),
  category TEXT DEFAULT '',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const createSchemaTest: string = `
DROP TABLE IF EXISTS test;
CREATE TABLE IF NOT EXISTS test (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT
);
`;

@Injectable()
export class MigrationService {

  constructor(private sqliteService: SQLiteService, private databaseService: DatabaseService) {
  }

  async migrate(): Promise<any> {
    await this.createTestTable();
    await this.createProductsTable();
  }

  async createProductsTable(): Promise<any> {
    await this.databaseService.executeQuery(async (db) => {
      await db.execute(createSchemaProducts);
    });
  }

  async createTestTable(): Promise<void> {
    console.log(`going to create a connection`)
    const db = await this.sqliteService.createConnection(environment.databaseName, false, "no-encryption", 1);
    console.log(`db ${JSON.stringify(db)}`)
    await db.open();
    console.log(`after db.open`)

    const res: any = await db.execute(createSchemaTest);
    console.log(`>>> res: ${JSON.stringify(res)}`)
    const resI0:any = await db.run("INSERT INTO test (name,email) VALUES ('Ackerman','ackerman@example.com') , ('Jefferson','jefferson@example.com');",[],true,'no');
    console.log(`>>> resI0: ${JSON.stringify(resI0)}`)
    const resI:any = await db.run("INSERT INTO test (name,email) VALUES ('Jeepq','jeepq@example.com') , ('Brown','brown@example.com') RETURNING *;",[],true,'all');
    console.log(`>>> resI: ${JSON.stringify(resI)}`)
    const resI1:any = await db.run("INSERT INTO test (name,email) VALUES ('Jones','jones@example.com') , ('Davison','davison@example.com') RETURNING email;",[],true,'one');
    console.log(`>>> resI1: ${JSON.stringify(resI1)}`)
    const resI2:any = await db.run("INSERT INTO test (name,email) VALUES ('White','white@example.com') , ('Johnson','Johnson@example.com') RETURNING name;",[],true,'no');
    console.log(`>>> resI2: ${JSON.stringify(resI2)}`)
    const resI3:any = await db.run("INSERT INTO test (name,email) VALUES (?,?) , (?,?) RETURNING name;",['Dupond','dupond@example.com','Toto','toto@example.com'],true,'all');
    console.log(`>>> resI3: ${JSON.stringify(resI3)}`)
    const resU1:any = await db.run("UPDATE test SET email='jeepq.@company.com' WHERE name='Jeepq' RETURNING id,email;",[],true,'one');
    console.log(`>>> resU1: ${JSON.stringify(resU1)}`)
    const resD1:any = await db.run("DELETE FROM test WHERE id IN (2,4,6) RETURNING id,name;",[],true,'all');
    console.log(`>>> resD1: ${JSON.stringify(resD1)}`)
    const resQ1: any = await db.query('SELECT * FROM test;');
    console.log(`>>> resQ1: ${JSON.stringify(resQ1)}`)

    let setUsers = [
      { statement:"INSERT INTO test (name,email) VALUES ('Simpson','simpson@example.com'), ('Devil', 'devil@example.com') RETURNING *;",
        values:[
        ]
      },
      { statement:"INSERT INTO test (name,email) VALUES ('Dowson','dowson@example.com'), ('Castel', null) RETURNING name;",
        values:[
        ]
      },
      { statement:"INSERT INTO test (name,email) VALUES (?,?) RETURNING *;",
        values:[
          ['Jackson','jackson@example.com'],
          ['Kennedy',null]
        ]
      },
      { statement:"UPDATE test SET email = 'jackson@company.com' WHERE name = 'Jackson' RETURNING *;",
        values:[
        ]
      },
      { statement:"DELETE FROM test WHERE id IN (1,3,9) RETURNING *;",
        values:[
        ]
      }
    ];
    const resS1 = await db.executeSet(setUsers, false, 'all');
    console.log(`>>> resS1: ${JSON.stringify(resS1)}`)

    setUsers = [
      { statement:"INSERT INTO test (name,email) VALUES ('Valley','valley@example.com'), ('Botta', 'Botta@example.com') RETURNING name;",
        values:[
        ]
      }
    ];
    const resS2 = await db.executeSet(setUsers, false, 'one');
    console.log(`>>> resS2: ${JSON.stringify(resS2)}`)
    setUsers = [
      { statement:"INSERT INTO test (name,email) VALUES ('Fisher','fisher@example.com'), ('Summerfield', 'summerfield@example.com') RETURNING *;",
        values:[
        ]
      }
    ];
    const resS3 = await db.executeSet(setUsers, false, 'no');
    console.log(`>>> resS3: ${JSON.stringify(resS3)}`)
    const resQ2: any = await db.query('SELECT * FROM test;');
    console.log(`>>> resQ2: ${JSON.stringify(resQ2)}`)
    await this.sqliteService.closeConnection(environment.databaseName);
    console.log(`after closeConnection`)
  }
}
