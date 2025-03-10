import {openDB} from "idb";
import CacheDriverType from "@/enums/CacheDriverType";

class CacheManager {


    /**
     * Get data from the cache.
     * @param {string} key - The cache key.
     * @param {"LocalStorage"|"CacheStorage"|"IndexedDB"} cacheType - The cache type.
     * @returns {Promise<any>} Cached data or null if not found.
     */
    static async get(key, cacheType) {

        if (cacheType === CacheDriverType.LOCAL_STORAGE) {
            return JSON.parse(localStorage.getItem(key)) || null;
        } else if (cacheType === CacheDriverType.CACHE_STORAGE) {
            const cache = await caches.open('api-cache');
            const response = await cache.match(key);
            return response ? await response.json() : null;
        } else if (cacheType === CacheDriverType.INDEXED_DB) {
            const db = await this._getIndexedDB();
            const data = await db.get('api-cache', key);
            return data || null;
        } else {
            throw new Error(`Unsupported cache type: ${cacheType}`);
        }
    }

    /**
     * Set data to the cache.
     * @param {string} key - The cache key.
     * @param {any} data - The data to cache.
     * @param {"LocalStorage"|"CacheStorage"|"IndexedDB"} cacheType - The cache type.
     * @returns {Promise<void>}
     */
    static async set(key, data, cacheType) {
        if (cacheType === CacheDriverType.LOCAL_STORAGE) {
            localStorage.setItem(key, JSON.stringify(data));
        } else if (cacheType === CacheDriverType.CACHE_STORAGE) {
            const cache = await caches.open('api-cache');
            const response = new Response(JSON.stringify(data));
            await cache.put(key, response);
        } else if (cacheType === CacheDriverType.INDEXED_DB) {
            const db = await this._getIndexedDB();
            await db.put('api-cache', data, key);
        } else {
            throw new Error(`Unsupported cache type: ${cacheType}`);
        }
    }

    /**
     * Internal method to get IndexedDB instance.
     * @returns {Promise<IDBPDatabase>}
     * @private
     */
    static async _getIndexedDB() {
        if (!this.dbPromise) {
            this.dbPromise = openDB('cache-db', 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains('api-cache')) {
                        db.createObjectStore('api-cache');
                    }
                },
            });
        }
        return this.dbPromise;
    }
}
 export default  CacheManager;
