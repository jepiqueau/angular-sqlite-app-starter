
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { environment } from 'src/environments/environment';
import { Product } from '../models/Product';

@Injectable()
export class ProductDefaultQueryRepository {
  constructor(private sqliteService: SQLiteService) {
  }

  async getProducts(): Promise<Product[]> {
    //create a connection and open
    const db = await this.sqliteService.createConnection(environment.databaseName, false, "no-encryption", 1);
    await db.open();

    //do your queries
    var products: DBSQLiteValues = await db.query("select * from products");

    //close the connection
    await this.sqliteService.closeConnection(environment.databaseName);

    //return the data
    return products.values as Product[];
  }

}
