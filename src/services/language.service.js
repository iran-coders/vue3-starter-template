import LocalStorageService from './local-storage.service';

import { createI18n as createVueI18N } from 'vue-i18n';

import en from '@/locales/en/index';
import fa from '@/locales/fa/index';

class LanguageService {
    /**
     * Storage key
     *
     * @returns {String}
     */
    static get STORAGE_KEY() {
        return 'locale';
    }

    /**
     * Default language
     *
     * @returns {String}
     */
    static get DEFAULT() {
        return 'en';
    }

    /**
     * Set language
     *
     * @param {String} value
     * @returns void
     */
    static set(value) {
        LocalStorageService.set(this.STORAGE_KEY, value);
        location.reload();
    }

    /**
     * Get language
     *
     * @returns {String}
     */
    static get() {
        return LocalStorageService.get(this.STORAGE_KEY) ?? this.DEFAULT;
    }

    /**
     * Current language is rtl
     *
     * @returns {Boolean}
     */
    static isRtl() {
        return ['fa'].includes(this.get());
    }
}

export default LanguageService;

const vueI18N = createVueI18N({
    locale: LanguageService.get(),
    fallbackLocale: LanguageService.DEFAULT,
    messages: { en, fa }
});

export function createI18n() {
    return vueI18N;
}

export function t(...args) {
    return vueI18N.global.t(...args);
}
