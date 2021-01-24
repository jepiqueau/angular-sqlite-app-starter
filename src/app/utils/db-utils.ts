import { SQLiteDBConnection } from '@capacitor-community/sqlite';

export async function deleteDatabase(db: SQLiteDBConnection): Promise<boolean> {
    let ret: any = await db.isExists();
    const dbName = db.getConnectionDBName();
    if(ret) {
      console.log("$$$ database " + dbName + " before delete");
      ret = await db.delete();
      console.log("$$$ database " + dbName + " after delete " + ret.result);
    }
    return ret;
}
