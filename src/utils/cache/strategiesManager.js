import CacheManager from "@/utils/cache/cacheManager";
import CacheStrategies from "@/enums/CacheStrategies";
import CacheDriverType from "@/enums/CacheDriverType";

class StrategiesManager {

    /**
     * Handle the `justCache` strategy.
     * @param {string} key - The cache key.
     * @param {"LocalStorage"|"CacheStorage"|"IndexedDB"} cacheType - The cache type.
     * @returns {Promise<any>} Cached data.
     * @throws {Error} If data is not found in the cache.
     */
    static async justCache(key, cacheType) {
        const cachedData = await CacheManager.get(key, cacheType);
        if (cachedData) {
            return { data: cachedData, fromCache: true };
        }
        throw new Error('Data not found in cache');
    }

    /**
     * Handle the `cacheFirstThenUpdate` strategy.
     * @param {string} key - The cache key.
     * @param {"LocalStorage"|"CacheStorage"|"IndexedDB"} cacheType - The cache type.
     * @param {string} url - The URL to fetch data from.
     * @param {AxiosRequestConfig} config - Axios config.
     * @param {AxiosInstance} axiosInstance - The Axios instance.
     * @returns {Promise<any>} Cached data if available, otherwise fetched data.
     */
    static async cacheFirstThenUpdate(key, cacheType, url, config, axiosInstance) {
        const cachedData = await CacheManager.get(key, cacheType);
        if (cachedData) {
            // Return cached data immediately
            setTimeout(async () => {
                try {
                    const response = await axiosInstance.get(url, config);
                    await CacheManager.set(key, response.data, cacheType);
                } catch (err) {
                    console.error('Failed to update cache:', err);
                }
            }, 0);
            return { data: cachedData, fromCache: true };
        }
        // If no cached data, fetch from API
        const response = await axiosInstance.get(url, config);
        await CacheManager.set(key, response.data, cacheType);
        return response;
    }

    /**
     * Execute the specified caching strategy.
     * @param {string} strategy - The strategy to execute.
     * @param {Object} options - The options required for the strategy.
     * @returns {Promise<any>} The response data.
     */
    static async executeStrategy(strategy, options) {

        switch (strategy) {
            case CacheStrategies.JUST_CACHE:
                return this.justCache(options.key, options.cacheType);

            case CacheStrategies.CACHE_FIRST_THEN_UPDATE:
                return this.cacheFirstThenUpdate(
                    options.key,
                    options.cacheType,
                    options.url,
                    options.config,
                    options.axiosInstance
                );

            default:
                throw new Error(`Unsupported caching strategy: ${strategy}`);
        }
    }
}

export default StrategiesManager
