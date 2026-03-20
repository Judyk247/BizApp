import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shop.db');

export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT,
          unit TEXT,
          selling_price REAL NOT NULL,
          cost_price REAL,
          current_stock REAL DEFAULT 0,
          reorder_level REAL DEFAULT 0,
          expiry_date TEXT,
          is_service INTEGER DEFAULT 0,
          businessId INTEGER NOT NULL,
          updated_at TEXT,
          synced INTEGER DEFAULT 0
        )`,
        [],
        () => {
          // Create other tables similarly
          resolve();
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const insertOrUpdate = (table, data) => {
  // Implement upsert based on id
};

export const queueOperation = (operation, table, data) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO sync_queue (operation, table_name, data) VALUES (?, ?, ?)`,
        [operation, table, JSON.stringify(data)],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};
