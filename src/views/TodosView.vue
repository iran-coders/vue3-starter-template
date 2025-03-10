<template>
    <div class="h3 mb-4">{{ $t('Todos') }}</div>

    <TodosFilter
        v-model="filters"
        class="mb-4"
    />

    <VTableServer
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :items="todos"
        :items-length="200"
        :is-loading="todosLoading"
    >
        <VColumn :header="$t('Id')" field="id"/>
        <VColumn :header="$t('Title')" field="title"/>

        <VColumn :header="$t('User')" field="userId">
            <template v-if="userStore.isLoading" #body>
                <div class="placeholder-glow">
                    <span class="placeholder rounded col-8"></span>
                </div>
            </template>

            <template v-else #body="{ item }">
                {{ userStore.itemsKeyById[item.userId].name }}
            </template>
        </VColumn>

        <VColumn :header="$t('Status')" field="completed">
            <template #body="{ item }">
                <span v-if="item.completed">
                    <i class="bi-check-circle-fill text-success me-1"></i>
                    {{ $t('Completed') }}
                </span>

                <span v-else>
                    <i class="bi-dash-circle text-danger me-1"></i>
                    {{ $t('Not completed') }}
                </span>
            </template>
        </VColumn>
    </VTableServer>
</template>

<script>
    import { watch } from 'vue';

    // Components
    import TodosFilter from '@/components/todos/TodosFilter.vue';
    import VTableServer from '@/components/data-table/VTableServer.vue';
    import VColumn from '@/components/data-table/VColumn.vue';

    // Composables
    import { useFetchTodos } from '@/composables/todo.composable';
    import { useRoutePagination } from '@/composables/pagination.composable';
    import { useApplyFilters } from '@/composables/filter.composable';

    // Stores
    import { useUserStore } from '@/stores/user.store';
    import CacheDriverType from "@/enums/CacheDriverType";
    import CacheStrategies from "@/enums/CacheStrategies";

    export default {
        name: 'TodosView',

        components: {
            TodosFilter,
            VTableServer,
            VColumn
        },

        setup() {
            const { todosLoading, todos, fetchTodos } = useFetchTodos({
                cache:true,
                cacheType:CacheDriverType.INDEXED_DB,
                strategy:CacheStrategies.CACHE_FIRST_THEN_UPDATE
            });
            const { page, itemsPerPage, paginationParams } = useRoutePagination();

            const filters = useApplyFilters({
                title: undefined,
                userId: undefined,
                completed: undefined
            });

            function fetch() {
                const config = {
                    params: {
                        ...paginationParams.value,
                        ...filters
                    }
                };

                return fetchTodos(config);
            }

            fetch();

            watch([paginationParams, filters], () => fetch());

            const userStore = useUserStore();
            userStore.fetch();

            return {
                todosLoading,
                todos,

                page,
                itemsPerPage,

                filters,

                userStore
            };
        }
    }
</script>
