// Utils
import { isEmptyObject } from '@/utils';

class BaseStrategy {
    /**
     * @type {Object}
     * @private
     */
    _cache;

    /**
     * @type {String}
     * @private
     */
    _cacheTag;

    /**
     * @type {Object}
     * @private
     */
    _driver;

    constructor(cacheTag, driver) {
        this._cacheTag = cacheTag;
        this._driver = driver;

        this._cache = this._getCache() ?? {};
    }

    // Private

    /**
     * Get cache by tag
     *
     * @private
     * @returns {Object|null}
     */
    _getCache() {
        return this._driver.get(this._cacheTag);
    }

    /**
     * Set cache by tag
     *
     * @private
     * @returns void
     */
    _setCache() {
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