// Utils
import { isEmptyObject } from '@/utils';

// Services
import LocalStorageService from '@/services/local-storage.service';

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

    constructor(cacheTag = 'global', driver = LocalStorageService) {
        this._cacheTag = cacheTag;
        this._driver = driver;

        this._cache = this._getCache() ?? {};
    }

    /**
     * Retrieves cache from the storage driver.
     *
     * @private
     * @returns {Object|null}
     */
    _getCache() {
        return this._driver.get(this._cacheTag);
    }

    /**
     * Updates the cache in storage. If cache is empty, it clears storage.
     *
     * @private
     */
    _setCache() {
        if (isEmptyObject(this._cache)) {
            this._clearCache();
            return;
        }

        this._driver.set(this._cacheTag, this._cache);
    }

    /**
     * Clears the cache from storage.
     *
     * @private
     */
    _clearCache() {
        this._driver.delete(this._cacheTag);
    }
}

export default BaseStrategy;