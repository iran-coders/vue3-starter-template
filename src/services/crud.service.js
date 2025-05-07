import ApiService from "./api.service";

class CrudService {
    /**
     * Service url
     *
     * @throws {Error}
     * @returns {String}
     */
    static get URL() {
        throw new Error('You have to implement the static method "URL", for each class that extend CrudServices!');
    }

    /**
     * Get items
     *
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static getAll(config) {
        return ApiService.get(this.URL, config);
    }

    /**
     * Get item by id
     *
     * @param {Number|String} id
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static getOneById(id, config) {
        return ApiService.get(`${this.URL}/${id}`, config);
    }

    /**
     * Create item
     *
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static create(data, config) {
        return ApiService.post(`${this.URL}/create`, data, config);
    }

    static post(data, config) {
        return ApiService.post(`${this.URL}`, data, config);
    }

    /**
     * Update item by id
     *
     * @param {Number|String} id
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static update(id, data, config) {
        return ApiService.post(`${this.URL}/${id}/update`, data, config);
    }

    static put(id, data, config) {
        return ApiService.put(`${this.URL}/${id}`, data, config);
    }

    /**
     * Delete item by id
     *
     * @param {Number|String} id
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static delete(id, data, config) {
        return ApiService.post(`${this.URL}/${id}/delete`, data, config);
    }
}

export default CrudService;
