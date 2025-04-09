import axios from "axios";
import { urls } from "./apiUrls.service";
import HttpMethod from "@/enums/HttpMethod";

const baseURL = urls.baseUrl;
/**
 * @callback onFulfilledRequest
 * @param {AxiosRequestConfig} config
 */

/**
 * @callback onFulfilledResponse
 * @param {AxiosResponse} response
 */

const instance = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    baseURL,
    timeout: import.meta.env.VITE_API_TIMEOUT,
});

class ApiService {
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
        return instance.interceptors.response.use(onFulfilled, function (error) {
            onFulfilled(error.response);
            return Promise.reject(error);
        });
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
     * @returns {Promise<AxiosResponse>}
     */
    static request(config) {
        return instance.request(config);
    }

    /**
     * Get request
     *
     * @param {String} url
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static get(url, config) {
        return instance.get(url, config);
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
