import { ref, computed } from 'vue';

// Service
import UserService from '@/services/user.service';

// Composables
import { useLoading } from '@/composables/loading.composable';

// Utils
import { keyBy } from '@/utils';
import StrategiesManager from "@/utils/cache/strategiesManager";
import CacheDriverType from "@/enums/CacheDriverType";
import CacheStrategies from "@/enums/CacheStrategies";
/**
 * Hook to fetch all todos with caching options.
 * @param {Object} options - Options for caching.
 * @param {boolean} [options.cache=false] - Enable or disable caching.
 * @param {"LocalStorage"|"CacheStorage"|"IndexedDB"} [options.cacheType=CacheDriverType.LOCAL_STORAGE] - Cache type.
 * @param {"justCache"|"cacheFirstThenUpdate"} [options.strategy=CacheStrategies.CACHE_FIRST_THEN_UPDATE] - Caching strategy.
 */
export function useFetchUsers(options = {}) {
    const {
        cache = false,
        cacheType = CacheDriverType.INDEXED_DB,
        strategy = CacheStrategies.CACHE_FIRST_THEN_UPDATE,
    } = options;
    const { isLoading, startLoading, endLoading } = useLoading();

    const users = ref([]);

    const usersKeyById = computed(() => keyBy(users.value, 'id'));
    /**
     * @param {AxiosRequestConfig} [config]
     */
    function fetchUsers(config) {
        startLoading();

        return UserService.getAll(config, cache, cacheType, strategy)
            .then(function (response) {
                users.value = response.data;
                return response;
            })
            .finally(function () {
                endLoading();
            });
    }

    return {
        usersLoading: isLoading,
        users,
        usersKeyById,
        fetchUsers
    };
}

export function useFetchUser(initialValue = UserService.getDefault()) {
    const { isLoading, startLoading, endLoading } = useLoading();

    const user = ref(initialValue);

    function fetchUserById(id) {
        startLoading();

        return UserService.getOneById(id)
            .then(function (response) {
                user.value = response.data;
                return response;
            })
            .finally(function () {
                endLoading();
            });
    }

    return {
        userLoading: isLoading,
        user,
        fetchUserById
    };
}
