import { db, insertOrUpdate, queueOperation } from '../db/database';
import api from '../api';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = null;
    // AppState listener omitted for brevity
  }

  async sync() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      // Get unsynced operations from queue
      const unsynced = await this.getUnsyncedOperations();
      if (unsynced.length > 0) {
        const payload = {
          lastSync: this.lastSyncTime,
          changes: unsynced.map(op => ({
            model: op.table_name,
            action: op.operation,
            data: JSON.parse(op.data)
          }))
        };
        const res = await api.post('/sync', payload);
        await this.markOperationsSynced(unsynced.map(op => op.id));
        await this.applyServerChanges(res.data.serverChanges);
        this.lastSyncTime = new Date().toISOString();
      }
    } catch (err) {
      console.error('Sync error', err);
    } finally {
      this.isSyncing = false;
    }
  }

  getUnsyncedOperations() {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM sync_queue WHERE synced = 0 ORDER BY id',
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });
  }

  markOperationsSynced(ids) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE sync_queue SET synced = 1 WHERE id IN (${ids.join(',')})`,
          [],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  async applyServerChanges(serverChanges) {
    const tables = ['products', 'suppliers', 'purchases', 'customers', 'sales', 'creditTransactions'];
    for (const table of tables) {
      const items = serverChanges[table] || [];
      for (const item of items) {
        await insertOrUpdate(table, item);
      }
    }
  }

  queueOperation(operation, table, data) {
    return queueOperation(operation, table, data);
  }
}

export default new SyncManager();
