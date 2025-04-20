import { ref, computed } from 'vue';

// Service
import TodoRepository from '@/repositories/todo.repository';

// Composables
import { useLoading } from '@/composables/loading.composable';

// Utils
import { keyBy } from '@/utils';

export function useFetchTodos() {
    const { isLoading, startLoading, endLoading } = useLoading();

    const todos = ref([]);

    const todosKeyById = computed(() => keyBy(todos.value, 'id'));

    /**
     * @param {AxiosRequestConfig} [config]
     */
    function fetchTodos(config) {
        startLoading();

        return TodoRepository.getAll(config)
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

export function useFetchTodo(initialValue = TodoRepository.getDefault()) {
    const { isLoading, startLoading, endLoading } = useLoading();

    const todo = ref(initialValue);

    function fetchTodoById(id) {
        startLoading();

        return TodoRepository.getOneById(id)
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
