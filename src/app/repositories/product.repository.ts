
import { DBSQLiteValues, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import productsData from './products-data-example';
import { Product } from '../models/Product';
@Injectable()
export class ProductRepository {
  constructor(private _databaseService: DatabaseService) {
  }

  async getProducts(): Promise<Product[]> {
    return this._databaseService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      var products: DBSQLiteValues = await db.query("select * from products");
      return products.values as Product[];
    });
  }

  async createProduct(product: Product) {
    return this._databaseService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      if (!product.imageUrl) {
        product.imageUrl = 'https://via.placeholder.com/150';
      }
      let sqlcmd: string = "insert into products (name, description, price, imageUrl, isAvailable, isPopular, category) values (?, ?, ?, ?, ?, ?, ?)";
      let values: Array<any> = [product.name, product.description, product.price, product.imageUrl, product.isAvailable, product.isPopular, product.category];
      let ret: any = await db.run(sqlcmd, values);
      if (ret.changes.lastId > 0) {
        return ret.changes as Product;
      }
      throw Error('create product failed');
    });
  }

  async updateProduct(product: Product) {
    return this._databaseService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      let sqlcmd: string = "update products set name = ?, description = ?, price = ?, imageUrl = ?, isAvailable = ?, isPopular = ?, category = ? where id = ?";
      let values: Array<any> = [product.name, product.description, product.price, product.imageUrl, product.isAvailable, product.isPopular, product.category, product.id];
      let ret: any = await db.run(sqlcmd, values);
      if (ret.changes.changes > 0) {
        return await this.getProductById(product.id);
      }
      throw Error('update product failed');
    });
  }

  async getProductById(id: number): Promise<Product> {
    return this._databaseService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      let sqlcmd: string = "select * from products where id = ? limit 1";
      let values: Array<any> = [id];
      let ret: any = await db.query(sqlcmd, values);
      if (ret.values.length > 0) {
        return ret.values[0] as Product;
      }
      throw Error('get product by id failed');
    });
  }

  async deleteProductById(id: number): Promise<void> {
    return this._databaseService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      await db.query(`delete from products where id = ${id};`);
    });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this._databaseService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      let sqlcmd: string = "select * from products where category = ?";
      let values: Array<any> = [category];
      let ret: any = await db.query(sqlcmd, values);
      if (ret.values.length > 0) {
        return ret.values as Product[];
      }
      throw Error('get products by category failed');
    });
  }

  async createTestData(): Promise<any> {
    await this._databaseService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      //delete all products
      let sqlcmd: string = "DELETE FROM products;";
      await db.execute(sqlcmd, false);
    });

    let products: Product[] = productsData;

    for (let product of products) {
      await this.createProduct(product);
    }
  }
}
