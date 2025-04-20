class BaseRepository {
    /**
     * Repository url
     *
     * @throws {Error}
     * @returns {String}
     */
    get URL() {
        throw new Error(
            'You have to implement the static method "URL", for each class that extend BaseRepositories!'
        );
    }
}

export default BaseRepository;