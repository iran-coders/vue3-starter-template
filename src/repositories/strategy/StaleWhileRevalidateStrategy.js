import BaseStrategy from './BaseStrategy';

class StaleWhileRevalidateStrategy extends BaseStrategy {
    /**
     * @param {Object} config
     * @param {Number} [config.ttl]
     * @param {Object} [config.driver]
     * @param {String} [config.cacheTag]
     */
    constructor(config) {
        super(config);
    }

    /**
     * Store a value by cache key
     *
     * @param {String} key
     * @param {*} value
     * @return void
     */
    put(key, value) {
        if (value === null || value === undefined) {
            return;
        }

        this._cache[key] = {
            value,
            expire_at: Date.now() + this._ttl
        };

        this._saveCache();
    }

    /**
     * Tries to fetch data from the cache first, and simultaneously revalidates the cache by fetching from the network.
     *
     * @param {String} key
     * @param {Function} callback
     * @return {Promise<*>}
     */
    get(key, callback) {
        return new Promise((resolve, reject) => {
            if (this.has(key)) {
                callback().then((response) => {
                    this.put(key, response);
                });

                resolve(this._cache[key].value);
                return;
            }

            this.delete(key);

            if (typeof callback !== 'function') {
                reject(new Error('Callback must be a function'));
                return;
            }

            callback().then((response) => {
                this.put(key, response);
                resolve(response);
            }).catch(reject);
        });
    }

    /**
     * Check if a valid value exists by cache key
     *
     * @param {String} key
     * @return {Boolean}
     */
    has(key) {
        const data = this._cache[key];
        return data !== undefined && Date.now() < data.expire_at;
    }

    /**
     * Remove a value by cache key
     *
     * @param {String} key
     * @return void
     */
    delete(key) {
        if (this._cache[key]) {
            delete this._cache[key];
            this._saveCache();
        }
    }

    /**
     * Clear all cached data by tag
     *
     * @return void
     */
    clear() {
        this._cache = {};
        this._clearCache();
    }
}

export default StaleWhileRevalidateStrategy;