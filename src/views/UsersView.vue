<template>
    <div class="h3 mb-4">{{ $t('Users') }}</div>

    <VTable
        :items="users"
        :items-length="users.length"
        :is-loading="usersLoading"
    >
        <VColumn :header="$t('Id')" field="id"/>
        <VColumn :header="$t('Name')" field="name"/>
        <VColumn :header="$t('Username')" field="username"/>
        <VColumn :header="$t('Email')" field="email"/>
    </VTable>
</template>

<script>
    // Components
    import VTable from '@/components/data-table/VTable.vue';
    import VColumn from '@/components/data-table/VColumn.vue';

    // Composables
    import { useFetchUsers } from '@/composables/user.composable';

    export default {
        name: 'UsersView',

        components: {
            VTable,
            VColumn
        },

        setup() {
            const { usersLoading, users, fetchUsers } = useFetchUsers();

            fetchUsers();

            return {
                usersLoading,
                users
            };
        }
    };
</script>
