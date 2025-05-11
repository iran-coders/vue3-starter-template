import StorageService from "@/services/storage.service";

export default function useLocaleStorageCache() {
    const getCache = (key) => {
        return StorageService.get(key);
    };
    const clearCache = (key) => StorageService.delete(key);

    const setCache = (key, value) => StorageService.set(key, value);

    return {
        getCache,
        clearCache,
        setCache,
    };
}
