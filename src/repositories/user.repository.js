import CrudRepository from './crud.repository';

class UserRepository extends CrudRepository {
    /**
     * Repository url
     *
     * @returns {String}
     */
    get URL() {
        return 'users';
    }

    /**
     * Get default item
     *
     * @returns {Object}
     */
    getDefault() {
        return {
            id: undefined,
            name: undefined,
            username: undefined,
            email: undefined,
            address: {
                street: undefined,
                suite: undefined,
                city: undefined,
                zipcode: undefined,
                geo: {
                    lat: undefined,
                    lng: undefined
                }
            },
            phone: undefined,
            website: undefined,
            company: {
                name: undefined,
                catchPhrase: undefined,
                bs: undefined
            }
        };
    }
}

export default new UserRepository();