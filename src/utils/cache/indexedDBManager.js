import { openDB } from 'idb';

/**
 * IndexedDBManager for managing IndexedDB operations.
 */
class IndexedDBManager {
    /** @type {string} */
    static dbName = 'my-app-db';

    /** @type {string} */
    static storeName = 'api-cache';

    /** @type {Promise<IDBDatabase> | null} */
    static dbPromise = null;

    /**
     * Configures the database and object store names.
     * @param {string} dbName - The name of the database.
     * @param {string} storeName - The name of the object store.
     * @example
     * IndexedDBManager.configure('custom-db', 'custom-store');
     */
    static configure(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    /**
     * Initializes the IndexedDB database.
     * @returns {Promise<IDBDatabase>} A promise that resolves to the database instance.
     * @private
     */
    static async initDB() {
        if (!this.dbPromise) {
            this.dbPromise = openDB(this.dbName, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(IndexedDBManager.storeName)) {
                        db.createObjectStore(IndexedDBManager.storeName, { keyPath: 'key' });
                    }
                },
            });
        }
        return this.dbPromise;
    }

    /**
     * Saves data to IndexedDB.
     * @param {string} key - The key to identify the data.
     * @param {*} data - The data to be saved.
     * @returns {Promise<void>} A promise that resolves when the data is saved.
     * @example
     * await IndexedDBManager.save('exampleKey', { value: 42 });
     */
    static async save(key, data) {
        const db = await this.initDB();
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        await store.put({ key, data });
        await tx.done;
    }

    /**
     * Loads data from IndexedDB.
     * @param {string} key - The key to identify the data.
     * @returns {Promise<*>} A promise that resolves to the loaded data, or null if not found.
     * @example
     * const data = await IndexedDBManager.load('exampleKey');
     * console.log(data);
     */
    static async load(key) {
        const db = await this.initDB();
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const result = await store.get(key);
        await tx.done;
        return result ? result.data : null;
    }

    /**
     * Deletes data from IndexedDB.
     * @param {string} key - The key to identify the data to be deleted.
     * @returns {Promise<void>} A promise that resolves when the data is deleted.
     * @example
     * await IndexedDBManager.delete('exampleKey');
     */
    static async delete(key) {
        const db = await this.initDB();
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        await store.delete(key);
        await tx.done;
    }

    /**
     * Clears all data from the object store.
     * @returns {Promise<void>} A promise that resolves when the store is cleared.
     * @example
     * await IndexedDBManager.clear();
     */
    static async clear() {
        const db = await this.initDB();
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        await store.clear();
        await tx.done;
    }

    /**
     * Retrieves all keys from the object store.
     * @returns {Promise<string[]>} A promise that resolves to an array of keys.
     * @example
     * const keys = await IndexedDBManager.getAllKeys();
     * console.log(keys);
     */
    static async getAllKeys() {
        const db = await this.initDB();
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const keys = await store.getAllKeys();
        await tx.done;
        return keys;
    }
}

export default IndexedDBManager;
