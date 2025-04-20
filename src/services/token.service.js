import LocalStorageService from './local-storage.service';

class TokenService {
    /**
     * Storage key
     *
     * @returns {String}
     */
    static get STORAGE_KEY() {
        return 'auth_token';
    }

    /**
     * Set token
     *
     * @param {String} value
     * @returns void
     */
    static set(value) {
        LocalStorageService.set(this.STORAGE_KEY, value);
    }

    /**
     * Get token
     *
     * @returns {String}
     */
    static get() {
        return LocalStorageService.get(this.STORAGE_KEY);
    }

    /**
     * Token is exist
     *
     * @returns {Boolean}
     */
    static isExist() {
        return LocalStorageService.has(this.STORAGE_KEY);
    }

    /**
     * Clear token
     *
     * @returns void
     */
    static clear() {
        LocalStorageService.delete(this.STORAGE_KEY);
    }
}

export default TokenService;
