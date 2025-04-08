import CrudService from "./crud.service";

class TodoTestService extends CrudService {
    /**
     * Service url
     *
     * @returns {String}
     */
    static URL = "todos";

    /**
     * Set service URL dynamically
     *
     * @param {String} newUrl
     */
    static setURL(newUrl) {
        this.URL = newUrl;
    }

    /**
     * Get default item
     *
     * @returns {Object}
     */
    // static getDefault() {
    //     return {
    //         userId: undefined,
    //         id: undefined,
    //         title: undefined,
    //         completed: false
    //     };
    // }
}

export default TodoTestService;
