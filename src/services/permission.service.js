import LocalStorageService from './local-storage.service';

class PermissionService {
    /**
     * @private
     * @type {Object}
     */
    static _permissions = LocalStorageService.get(this.STORAGE_KEY) || {};

    /**
     * Storage key
     *
     * @returns {String}
     */
    static get STORAGE_KEY() {
        return 'permissions';
    }

    /**
     * Set permissions
     *
     * @param {Array} permissions
     * @returns void
     */
    static set(permissions) {
        for (const permission of permissions) {
            this._permissions[permission] = true;
        }

        LocalStorageService.set(this.STORAGE_KEY, this._permissions);
    }

    /**
     * Determine if it has a permission
     *
     * @param {String} name
     * @returns {Boolean}
     */
    static has(name) {
        return Boolean(this._permissions[name]);
    }

    /**
     * Determine if it has all the requested permissions
     *
     * @param {String[]} names
     * @returns {Boolean}
     */
    static hasAll(names) {
        return names.every((name) => this.has(name));
    }

    /**
     * Determine if it has any of the requested permissions
     *
     * @param {String[]} names
     * @returns {Boolean}
     */
    static hasAny(names) {
        return names.some((name) => this.has(name));
    }

    /**
     * Clear permissions
     *
     * @returns void
     */
    static clear() {
        this._permissions = {};
        LocalStorageService.delete(this.STORAGE_KEY);
    }
}

export default PermissionService;
