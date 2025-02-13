import CrudRepository from './crud.repository';

class TodoRepository extends CrudRepository {
    /**
     * Repository url
     *
     * @returns {String}
     */
    get URL() {
        return 'todos';
    }

    /**
     * Get default item
     *
     * @returns {Object}
     */
    getDefault() {
        return {
            userId: undefined,
            id: undefined,
            title: undefined,
            completed: false
        };
    }
}

export default new TodoRepository();