import LocalStorageService from './local-storage.service';

class ThemeService {
    /**
     * Storage key
     *
     * @returns {String}
     */
    static get STORAGE_KEY() {
        return 'theme';
    }

    /**
     * Default theme
     *
     * @returns {String}
     */
    static get DEFAULT() {
        return 'light';
    }

    /**
     * Set theme
     *
     * @param {String} value
     * @returns void
     */
    static set(value) {
        LocalStorageService.set(this.STORAGE_KEY, value);
        this.updateDOM();
    }

    /**
     * Update dom based on current theme
     *
     * @returns void
     */
    static updateDOM() {
        const rootEl = document.documentElement;
        rootEl.setAttribute('data-bs-theme', this.get());
    }

    /**
     * Get theme
     *
     * @returns {String}
     */
    static get() {
        return LocalStorageService.get(this.STORAGE_KEY) ?? this.DEFAULT;
    }
}

export default ThemeService;
