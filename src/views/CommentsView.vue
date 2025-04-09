<template>
<div class="h3 mb-4">{{ $t('comments') }}</div>

<CommentsFilter
    v-model="filters"
    class="mb-4"
/>

<VTable
    :items-length="500"
    :items="commentsStore.comments || []"
    :is-loading="commentsStore.isLoading"
    :hasPagination="false"
>
    <template #row="{item, columns}">
        <tr>
            <component :is="column" v-for="(column, index) of columns" :key="index"/>
        </tr>

    </template>
    <VColumn :header="$t('Id')" field="id"></VColumn>
    <VColumn :header="$t('Body')" field="body"></VColumn>
    <VColumn :header="$t('Status')" field="confirmed">
        <template #body="{ item }">
            <span v-if="item.status === 'pending'" class="d-flex">
                <i class="bi bi-hourglass text-primary"></i>
                {{ $t('Pending') }}
            </span>

            <span v-else-if="item.status === 'confirmed'" class="d-flex">
                    <i class="bi-check-circle-fill text-success me-1"></i>
                    {{ $t('Confirmed') }}
            </span>

            <span v-else class="d-flex">
                    <i class="bi-dash-circle text-danger me-1"></i>
                    {{ $t('Rejected') }}
            </span>
        </template>
    </VColumn>
    <VColumn :header="$t('Actions')" field="ddd">dsdsd</VColumn>
    <!--    <VColumn field="id" header="actions">-->
    <!--        <button >dddd</button>-->
    <!--    </VColumn>-->

</VTable>
</template>

<script setup>

import useComments from "@/composables/comments/comments.composable";
import VTable from "@/components/data-table/VTable.vue";
import VColumn from '@/components/data-table/VColumn.vue';
// import {useApplyFilters} from "@/composables/filter.composable";
import CommentsFilter from '@/components/comments/CommentsFilter.vue';
import {onMounted, ref, watch} from "vue";
import {useApplyFilters} from "@/composables/filter.composable";

const filters = useApplyFilters({
    id: undefined,
    length: undefined,
    status: undefined
});
// const aaa = ref([])

function fetch() {

    // commentsStore.comments
    //
    // aaa.value = commentsStore.comments.filter((comment) => {
    //     console.log('sssss', comment.body.includes(String(config.params.id)))
    //     return comment.id == config.params.id || comment.body.includes(String(config.params.id))
    // });
    //
    // console.log('aaa', aaa.value)

    //
    // const config = {
    //     params: {
    //         ...filters,
    //         id: filters.id || null,
    //     }
    // };

    return commentsStore.fetchComments(filters);
}

onMounted(()=> {
    fetch();
})

watch(filters, () => fetch());

console.log('filters', filters)

const {
    commentsStore,
} = useComments(filters);


</script>


<style lang="scss">

</style>
