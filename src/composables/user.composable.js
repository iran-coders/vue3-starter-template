import { ref, computed } from 'vue';

// Service
import UserRepository from '@/repositories/user.repository';

// Composables
import { useLoading } from '@/composables/loading.composable';

// Utils
import { keyBy } from '@/utils';

export function useFetchUsers() {
    const { isLoading, startLoading, endLoading } = useLoading();

    const users = ref([]);

    const usersKeyById = computed(() => keyBy(users.value, 'id'));

    function fetchUsers() {
        startLoading();

        return UserRepository.getAll()
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

export function useFetchUser(initialValue = UserRepository.getDefault()) {
    const { isLoading, startLoading, endLoading } = useLoading();

    const user = ref(initialValue);

    function fetchUserById(id) {
        startLoading();

        return UserRepository.getOneById(id)
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
