import BaseStrategy from './BaseStrategy';

// Services
import LocalStorageService from '@/services/local-storage.service';

class NetworkFirstStrategy extends BaseStrategy {
    /**
     * Cache time-to-live (milliseconds)
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
     * Store a value in cache
     *
     * @param {String} key
     * @param {*} value
     * @returns void
     */
    put(key, value) {
        if (value === undefined) {
            return;
        }

        this._cache[key] = {
            value,
            expire_at: Date.now() + this._ttl
        };

        this._setCache();
    }

    /**
     * Tries network first, falls back to cache if failed.
     *
     * @param {String} key
     * @param {Function} callback
     * @returns {Promise<*>}
     */
    get(key, callback) {
        if (typeof callback !== 'function') {
            return Promise.reject(new Error('Callback must be a function'));
        }

        const data = this._cache[key];

        return new Promise((resolve, reject) => {
            callback().then((response) => {
                this.put(key, response);
                resolve(response);
            }).catch((reason) => {
                if (data !== undefined) {
                    const { value, expire_at } = data;

                    if (Date.now() < expire_at) {
                        resolve(value);
                    } else {
                        this.delete(key);
                    }
                }

                reject(reason);
            });
        });
    }

    /**
     * Check if a valid value exists in cache
     *
     * @param {String} key
     * @returns {Boolean}
     */
    has(key) {
        const data = this._cache[key];
        return data !== undefined && Date.now() < data.expire_at;
    }

    /**
     * Remove a value from cache
     *
     * @param {String} key
     * @returns void
     */
    delete(key) {
        if (this._cache[key]) {
            delete this._cache[key];
            this._setCache();
        }
    }

    /**
     * Clear all cached data
     *
     * @returns void
     */
    clear() {
        this._cache = {};
        this._clearCache();
    }
}

export default NetworkFirstStrategy;