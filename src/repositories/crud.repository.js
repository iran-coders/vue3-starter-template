import ApiRepository from './api.repository';
import BaseRepository from './base.repository';

class CrudRepository extends BaseRepository {
    /**
     * Get items
     *
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    getAll(config) {
        return ApiRepository.get(this.URL, config);
    }

    /**
     * Get item by id
     *
     * @param {Number|String} id
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    getOneById(id, config) {
        return ApiRepository.get(`${this.URL}/${id}`, config);
    }

    /**
     * Create item
     *
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    create(data, config) {
        return ApiRepository.post(`${this.URL}/create`, data, config);
    }

    /**
     * Update item by id
     *
     * @param {Number|String} id
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    update(id, data, config) {
        return ApiRepository.post(`${this.URL}/${id}/update`, data, config);
    }

    /**
     * Delete item by id
     *
     * @param {Number|String} id
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    delete(id, data, config) {
        return ApiRepository.post(`${this.URL}/${id}/delete`, data, config);
    }
}

export default CrudRepository;