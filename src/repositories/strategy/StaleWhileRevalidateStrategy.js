import BaseStrategy from './BaseStrategy';

// Services
import LocalStorageService from '@/services/local-storage.service';

class StaleWhileRevalidateStrategy extends BaseStrategy {
    /**
     * Cache time-to-live (in milliseconds)
     *
     * @type {Number}
     * @private
     */
    _ttl;

    constructor(cacheTag = 'global', driver = LocalStorageService, ttl = 60_000) {
        super(cacheTag, driver);

        this._ttl = ttl;
    }

    /**
     * Stores a new value in the cache.
     *
     * @param {String} key
     * @param {*} value
     */
    put(key, value) {
        this._cache[key] = {
            value,
            expire_at: Date.now() + this._ttl
        };

        this._setCache();
    }

    /**
     * Tries to fetch data from the cache first, and simultaneously revalidates the cache by fetching from the network.
     *
     * @param {String} key
     * @param {Function} callback
     * @returns {Promise<*>}
     */
    get(key, callback) {
        const data = this._cache[key];

        if (data !== undefined) {
            const { value, expire_at } = data;

            if (Date.now() < expire_at) {
                callback().then((response) => this.put(key, response));
                return Promise.resolve(value);
            } else {
                this.delete(key);
            }
        }

        return new Promise((resolve, reject) => {
            callback().then((response) => {
                this.put(key, response);
                resolve(response);
            }).catch(reject);
        });
    }

    /**
     * Checks if a specific value exists in the cache.
     *
     * @param {String} key
     * @returns {Boolean}
     */
    has(key) {
        return Boolean(this._cache[key]);
    }

    /**
     * Deletes a specific value from the cache.
     *
     * @param {String} key
     */
    delete(key) {
        delete this._cache[key];
        this._setCache();
    }

    /**
     * Clears all values from the cache.
     */
    clear() {
        this._cache = {};
        this._clearCache();
    }
}

export default StaleWhileRevalidateStrategy;