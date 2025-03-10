import axios from 'axios';

import HttpMethod from '@/enums/HttpMethod';

import StrategiesManager from "@/utils/cache/strategiesManager"
import CacheManager from "@/utils/cache/cacheManager";

/**
 * @callback onFulfilledRequest
 * @param {AxiosRequestConfig} config
 */

/**
 * @callback onFulfilledResponse
 * @param {AxiosResponse} response
 */

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: import.meta.env.VITE_API_TIMEOUT
});

class ApiService {

    /**
     * Generate cache key based on URL and query params.
     * @param {string} url - The URL.
     * @param {Object} [params] - The query parameters.
     * @returns {string} Cache key.
     */
    static generateCacheKey(url, params = {}) {
        const queryParams = new URLSearchParams(params).toString();
        return queryParams ? `${url}?${queryParams}` : url;
    }
    /**
     * Set header for all or specific http method
     *
     * @param {String} name
     * @param {String} value
     * @param {String} [method]
     * @returns void
     */
    static setHeader(name, value, method) {
        if (!method) {
            instance.defaults.headers.common[name] = value;
            return;
        }

        if (!HttpMethod[method]) {
            throw new Error(`Invalid http method "${method}"`);
        }

        instance.defaults.headers[method][name] = value;
    }

    /**
     * Add request middleware
     *
     * @param {onFulfilledRequest} onFulfilled
     * @returns {Number} Middleware id
     */
    static addRequestMiddleware(onFulfilled) {
        return instance.interceptors.request.use(onFulfilled);
    }

    /**
     * Remove request middleware
     *
     * @param {Number} id
     * @returns void
     */
    static removeRequestMiddleware(id) {
        instance.interceptors.request.eject(id);
    }

    /**
     * Add response middleware
     *
     * @param {onFulfilledResponse} onFulfilled
     * @returns {Number} Middleware id
     */
    static addResponseMiddleware(onFulfilled) {
        return instance.interceptors.response.use(
            onFulfilled,
            function (error) {
                onFulfilled(error.response);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Remove response middleware
     *
     * @param {Number} id
     * @returns void
     */
    static removeResponseMiddleware(id) {
        instance.interceptors.response.eject(id);
    }

    /**
     * Custom request
     *
     * @param {AxiosRequestConfig} config
     * @param {Boolean} cache
     * @param {"LocalStorage"|"CacheStorage"|"IndexedDB"} cacheType
     * @param {"justCache"|"cacheFirstThenUpdate"} strategy - Caching strategy.
     * @returns {Promise<AxiosResponse>}
     */
    static async  request(config,cache,cacheType,strategy) {
        const url = config.url
        const key = this.generateCacheKey(url, config?.params ?config.params : {});
        if (cache && config.method==="get") {
            return StrategiesManager.executeStrategy(strategy, {
                key,
                cacheType,
                url,
                config,
                axiosInstance: instance,
            });
        }


        const response = await instance.get(url, config);
        if (cache && config.method==="get") {
            await CacheManager.set(key, response.data, cacheType);
        }
        return response;
    }

    /**
     * Get request
     *
     * @param {String} url
     * @param {AxiosRequestConfig} [config]
     * @param {Boolean} cache
     * @param {"LocalStorage"|"CacheStorage"|"IndexedDB"} cacheType
     * @param {"justCache"|"cacheFirstThenUpdate"} strategy - Caching strategy.
     * @returns {Promise<AxiosResponse>}
     */
    static async get(url, config,cache,cacheType,strategy = StrategiesManager.strategies.CACHE_FIRST_THEN_UPDATE) {
        const key = this.generateCacheKey(url, config?.params ?config.params : {});
        if (cache) {
            return StrategiesManager.executeStrategy(strategy, {
                key,
                cacheType,
                url,
                config,
                axiosInstance: instance,
            });
        }


        const response = await instance.get(url, config);
        if (cache) {
            await CacheManager.set(key, response.data, cacheType);
        }
        return response;
    }

    /**
     * Delete request
     *
     * @param {String} url
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static delete(url, config) {
        return instance.delete(url, config);
    }

    /**
     * Post request
     *
     * @param {String} url
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static post(url, data, config) {
        return instance.post(url, data, config);
    }

    /**
     * Put request
     *
     * @param {String} url
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static put(url, data, config) {
        return instance.put(url, data, config);
    }
}

export default ApiService;
