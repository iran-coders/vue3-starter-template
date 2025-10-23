import CrudService from "./crud.service";

class PostsServices extends CrudService {
    /**
     * Service url
     *
     * @returns {String}
     */
    static get URL() {
        return "posts";
    }

    /**
     * Get default item
     *
     * @returns {Object}
     */
    static getDefault() {
        return {
            userId: undefined,
            id: undefined,
            title: undefined,
            body: undefined,
        };
    }
}

export default PostsServices;
