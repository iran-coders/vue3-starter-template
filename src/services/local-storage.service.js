class LocalStorageService {
    /**
     * Set an item
     *
     * @param {String} name
     * @param {*} value
     * @returns void
     */
    set(name, value) {
        const stringifyValue = JSON.stringify(value);
        localStorage.setItem(name, stringifyValue);
    }

    /**
     * Get an item
     *
     * @param {String} name
     * @returns {*}
     */
    get(name) {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : undefined;
    }

    /**
     * Delete an item
     *
     * @param {String} name
     * @returns void
     */
    delete(name) {
        localStorage.removeItem(name);
    }

    /**
     * Determine if an item exists
     *
     * @param {String} name
     * @returns {Boolean}
     */
    has(name) {
        return Boolean(this.get(name));
    }
}

export default new LocalStorageService();