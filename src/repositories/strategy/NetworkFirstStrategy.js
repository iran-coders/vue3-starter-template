import BaseStrategy from './BaseStrategy';

class NetworkFirstStrategy extends BaseStrategy {
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
     * Tries network first, falls back to cache if failed.
     *
     * @param {String} key
     * @param {Function} callback
     * @return {Promise<*>}
     */
    get(key, callback) {
        return new Promise((resolve, reject) => {
            if (typeof callback !== 'function') {
                reject(new Error('Callback must be a function'));
                return;
            }

            const data = this._cache[key];

            callback().then((response) => {
                this.put(key, response);
                resolve(response);
            }).catch((reason) => {
                if (data !== undefined) {
                    const { value, expire_at } = data;

                    if (Date.now() < expire_at) {
                        resolve(value);
                        return;
                    } else {
                        this.delete(key);
                    }
                }

                reject(reason);
            });
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

export default NetworkFirstStrategy;