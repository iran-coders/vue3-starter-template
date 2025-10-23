import CrudService from "./crud.service";

class CommentsService extends CrudService {
    /**
     * Service url
     *
     * @returns {String}
     */
    static get URL() {
        return "comments";
    }

    /**
     * Get default item
     *
     * @returns {Object}
     */
    static getDefault() {
        return {
            postId: undefined,
            id: undefined,
            name: undefined,
            body: undefined,
            email: undefined,
        };
    }
}

export default CommentsService;
