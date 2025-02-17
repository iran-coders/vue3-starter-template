// Utils
import { isEmptyObject } from '@/utils';

// Services
import LocalStorageService from '@/services/local-storage.service';

const Default = {
    ttl: 60_000,
    driver: LocalStorageService,
    cacheTag: 'global'
};

class BaseStrategy {
    /**
     * @type {Object}
     * @private
     */
    _cache;

    /**
     * @type {Number}
     * @private
     */
    _ttl;

    /**
     * @type {Object}
     * @private
     */
    _driver;

    /**
     * @type {String}
     * @private
     */
    _cacheTag;

    /**
     * @param {Object} config
     * @param {Number} [config.ttl]
     * @param {Object} [config.driver]
     * @param {String} [config.cacheTag]
     */
    constructor(config) {
        // Todo => checking the type of configurations
        const { ttl, driver, cacheTag } = {
            ...Default,
            ...(typeof config === 'object' ? config : {})
        };

        this._ttl = ttl;
        this._driver = driver;
        this._cacheTag = cacheTag;

        this._cache = this._initializeCache();
    }

    // Private

    /**
     * Get cache bu tag
     *
     * @private
     * @returns {*|{}}
     */
    _initializeCache() {
        return this._driver.get(this._cacheTag) ?? {};
    }

    /**
     * Save cache by tag
     *
     * @private
     * @returns void
     */
    _saveCache() {
        if (isEmptyObject(this._cache)) {
            this._clearCache();
            return;
        }

        this._driver.set(this._cacheTag, this._cache);
    }

    /**
     * Clear cache by tag
     *
     * @private
     * @returns void
     */
    _clearCache() {
        this._driver.delete(this._cacheTag);
    }
}

export default BaseStrategy;