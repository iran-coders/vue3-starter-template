<template>
    <div class="border border-2 rounded-2 overflow-hidden position-relative bg-body">
        <table class="table mb-0">
            <VTableHeader :columns="columns" :class="{ 'd-none': isMobile }"/>
            <VTableBody
                :columns="columns"
                :row-slot="rowSlot"
                :items="paginatedItems"
                :is-loading="isLoading"
            />
        </table>

        <VPagination
            v-model="pageRef"
            v-model:size="itemsPerPageRef"
            :total="items.length"
        />

        <div v-if="isLoading" class="position-absolute top-0 start-0 h-100 w-100 bg-body bg-opacity-50 d-flex">
            <div v-if="items.length !== 0" class="spinner-border text-secondary m-auto" role="status">
                <span class="visually-hidden">{{ $t('Loading') }}...</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { computed } from 'vue';

    // Utils
    import Breakpoints from '@/utils/breakpoints';

    // Components
    import VTableHeader from '@/components/data-table/VTableHeader.vue';
    import VTableBody from '@/components/data-table/VTableBody.vue';
    import VPagination from '@/components/pagination/VPagination.vue';

    // Composables
    import { useModelRef } from '@/composables/model.composable';

    export default {
        name: 'VTable',

        components: {
            VTableHeader,
            VTableBody,
            VPagination
        },

        props: {
            items: {
                type: Array,
                required: true
            },
            page: {
                type: Number,
                default: 1
            },
            itemsPerPage: {
                type: Number,
                default: 10
            },
            isLoading: {
                type: Boolean,
                default: false
            }
        },

        emits: ['update:page', 'update:itemsPerPage'],

        setup(props, context) {
            const isMobile = Breakpoints.down(Breakpoints.SM);

            const rowSlot = computed(() => context.slots.row);
            const columns = computed(() => context.slots.default());

            const pageRef = useModelRef('page');
            const itemsPerPageRef = useModelRef('itemsPerPage');

            const paginatedItems = computed(() => {
                const start = (pageRef.value - 1) * itemsPerPageRef.value;
                const end = pageRef.value * itemsPerPageRef.value;

                return props.items.slice(start, end);
            });

            return {
                rowSlot,
                columns,

                isMobile,

                pageRef,
                itemsPerPageRef,

                paginatedItems
            };
        }
    }
</script>
