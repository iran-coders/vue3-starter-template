import { ref, computed } from 'vue';

// Service
import TodoService from '@/services/todo.service';

// Composables
import { useLoading } from '@/composables/loading.composable';

// Utils
import { keyBy } from '@/utils';
import StrategiesManager from "@/utils/cache/strategiesManager";
import CacheStrategies from "@/enums/CacheStrategies";
import CacheDriverType from "@/enums/CacheDriverType";
/**
 * Hook to fetch all todos with caching options.
 * @param {Object} options - Options for caching.
 * @param {boolean} [options.cache] - Enable or disable caching.
 * @param {"LocalStorage"|"CacheStorage"|"IndexedDB"} [options.cacheType] - Cache type.
 * @param {"justCache"|"cacheFirstThenUpdate"} [options.strategy] - Caching strategy.
 */
export function useFetchTodos(options = {}) {
    const {
        cache = false,
        cacheType = CacheDriverType.LOCAL_STORAGE,
        strategy = CacheStrategies.CACHE_FIRST_THEN_UPDATE,
    } = options;
    const { isLoading, startLoading, endLoading } = useLoading();

    const todos = ref([]);

    const todosKeyById = computed(() => keyBy(todos.value, 'id'));

    /**
     * @param {AxiosRequestConfig} [config]
     */
    function fetchTodos(config) {
        startLoading();

        return TodoService.getAll(config,cache, cacheType, strategy)
            .then(function (response) {
                todos.value = response.data;
                return response;
            })
            .finally(function () {
                endLoading();
            });
    }

    return {
        todosLoading: isLoading,
        todos,
        todosKeyById,
        fetchTodos
    };
}

export function useFetchTodo(initialValue = TodoService.getDefault()) {
    const { isLoading, startLoading, endLoading } = useLoading();

    const todo = ref(initialValue);

    function fetchTodoById(id) {
        startLoading();

        return TodoService.getOneById(id)
            .then(function (response) {
                todo.value = response.data;
                return response;
            })
            .finally(function () {
                endLoading();
            });
    }

    return {
        todoLoading: isLoading,
        todo,
        fetchTodoById
    };
}
