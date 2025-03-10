/**
 * LocalStorageManager for managing browser localStorage operations.
 */
class LocalStorageManager {
    /** @type {string} */
    static prefix = 'default-';

    /**
     * Configures a prefix for all keys to avoid conflicts.
     * @param {string} prefix - The prefix to use for all keys.
     * @example
     * LocalStorageManager.configure('custom-');
     */
    static configure(prefix) {
        this.prefix = prefix;
    }

    /**
     * Constructs the full key with the prefix.
     * @param {string} key - The key to construct.
     * @returns {string} The full key with the prefix.
     * @private
     */
    static constructKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Sets data in localStorage.
     * @param {string} key - The key to identify the data.
     * @param {*} data - The data to be stored (automatically stringified).
     * @example
     * LocalStorageManager.set('exampleKey', { value: 42 });
     */
    static set(key, data) {
        const fullKey = this.constructKey(key);
        localStorage.setItem(fullKey, JSON.stringify(data));
    }

    /**
     * Gets data from localStorage.
     * @param {string} key - The key to identify the data.
     * @returns {*} The retrieved data, or null if not found.
     * @example
     * const data = LocalStorageManager.get('exampleKey');
     * (data);
     */
    static get(key) {
        const fullKey = this.constructKey(key);
        const storedData = localStorage.getItem(fullKey);
        return storedData ? JSON.parse(storedData) : null;
    }

    /**
     * Deletes data from localStorage.
     * @param {string} key - The key to identify the data to be deleted.
     * @example
     * LocalStorageManager.delete('exampleKey');
     */
    static delete(key) {
        const fullKey = this.constructKey(key);
        localStorage.removeItem(fullKey);
    }

    /**
     * Clears all keys with the configured prefix from localStorage.
     * @example
     * LocalStorageManager.clear();
     */
    static clear() {
        const keys = Object.keys(localStorage);
        keys.forEach((storedKey) => {
            if (storedKey.startsWith(this.prefix)) {
                localStorage.removeItem(storedKey);
            }
        });
    }

    /**
     * Retrieves all keys with the configured prefix from localStorage.
     * @returns {string[]} An array of keys without the prefix.
     * @example
     * const keys = LocalStorageManager.getAllKeys();
     * console.log(keys);
     */
    static getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter((storedKey) => storedKey.startsWith(this.prefix))
            .map((storedKey) => storedKey.replace(this.prefix, ''));
    }
}

export default LocalStorageManager;
