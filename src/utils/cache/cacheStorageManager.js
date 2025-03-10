/**
 * CacheStorageManager for managing browser Cache Storage operations.
 */
class CacheStorageManager {
    /** @type {string} */
    static cacheName = 'default-cache';

    /**
     * Configures the cache name.
     * @param {string} cacheName - The name of the cache.
     * @example
     * CacheStorageManager.configure('custom-cache');
     */
    static configure(cacheName) {
        this.cacheName = cacheName;
    }

    /**
     * Retrieves the cache instance.
     * @returns {Promise<Cache>} A promise that resolves to the cache instance.
     * @private
     */
    static async getCache() {
        return await caches.open(this.cacheName);
    }

    /**
     * Sets data in the cache storage.
     * @param {string} key - The key to identify the data.
     * @param {*} data - The data to be stored (automatically stringified).
     * @returns {Promise<void>} A promise that resolves when the data is saved.
     * @example
     * await CacheStorageManager.set('exampleKey', { value: 42 });
     */
    static async set(key, data) {
        const cache = await this.getCache();
        const request = new Request(key);
        const response = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
        await cache.put(request, response);
    }

    /**
     * Gets data from the cache storage.
     * @param {string} key - The key to identify the data.
     * @returns {Promise<*>} A promise that resolves to the retrieved data, or null if not found.
     * @example
     * const data = await CacheStorageManager.get('exampleKey');
     * (data);
     */
    static async get(key) {
        const cache = await this.getCache();
        const request = new Request(key);
        const response = await cache.match(request);
        if (!response) return null;
        return await response.json();
    }

    /**
     * Deletes data from the cache storage.
     * @param {string} key - The key to identify the data to be deleted.
     * @returns {Promise<void>} A promise that resolves when the data is deleted.
     * @example
     * await CacheStorageManager.delete('exampleKey');
     */
    static async delete(key) {
        const cache = await this.getCache();
        const request = new Request(key);
        await cache.delete(request);
    }

    /**
     * Clears all data from the cache storage.
     * @returns {Promise<void>} A promise that resolves when the cache is cleared.
     * @example
     * await CacheStorageManager.clear();
     */
    static async clear() {
        await caches.delete(this.cacheName);
    }

    /**
     * Retrieves all keys from the cache storage.
     * @returns {Promise<string[]>} A promise that resolves to an array of keys.
     * @example
     * const keys = await CacheStorageManager.getAllKeys();
     * console.log(keys);
     */
    static async getAllKeys() {
        const cache = await this.getCache();
        const keys = [];
        const requests = await cache.keys();
        for (const request of requests) {
            keys.push(new URL(request.url).pathname); // Extracts the key from the URL
        }
        return keys;
    }
}

export default CacheStorageManager;
