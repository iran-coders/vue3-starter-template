class StorageService {
    /**
     * Set an item
     *
     * @param {String} name
     * @param {*} value
     * @returns void
     */
    static set(name, value) {
        const stringifyValue = JSON.stringify(value);
        localStorage.setItem(name, stringifyValue);
    }

    /**
     * Get an item
     *
     * @param {String} name
     * @returns {*}
     */
    static get(name) {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : undefined;
    }

    /**
     * Delete an item
     *
     * @param {String} name
     * @returns void
     */
    static delete(name) {
        localStorage.removeItem(name);
    }

    /**
     * Determine if an item exists
     *
     * @param {String} name
     * @returns {Boolean}
     */
    static has(name) {
        return Boolean(this.get(name));
    }

    static observe(eventKey , callback){
        window.addEventListener('storage',(event)=>{
            if(event.key === eventKey && event.newValue !==null) {
                callback(JSON.parse(event.newValue))
            }
        })
    }
}

export default StorageService;
