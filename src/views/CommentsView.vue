<template>
    <div>
        <div class="h3 mb-4">{{ $t('Comments') }}</div>
        <VTableServer :items="comments" :itemsLength="comments.length" :is-loading="commentsIsLoading">
            <VColumn :header="$t('Id')" field="id" />
            <VColumn :header="$t('Name')" field="name" />
            <VColumn :header="$t('Email')" field="email" />
            <VColumn :header="$t('Post')" field="postId">
                <template #body>
                    <button class="btn btn-sm btn-outline-info" title="View Related Post">
                        <i class="bi-eye" />
                    </button>
                </template>
            </VColumn>
            <VColumn :header="$t('Body')" field="body" />
            <VColumn :header="$t('Status')" field="id">
                <template #body="{ item }">
                    <span v-if="item.status==='PENDING'">
                        {{ $t('Pending') }}
                    </span>
                    <span v-if="item.status==='CONFIRMED'">
                        {{$t('Confirmed')}}
                    </span>
                    <span v-if="item.status==='REJECTED'">
                        {{ $('Rejected') }}
                    </span>
                </template>
            </VColumn>
            <VColumn :header="$t('Actions')" field="id">
                <template #body>
                    <div class="d-flex gap-2">
                        <button class="btn btn-danger btn-sm">
                            <i class="bi-ban" />
                        </button>
                        <button class="btn btn-success btn-sm z-3" data-bs-toggle="tooltip" data-bs-placement="top"
                            data-bs-title="Tooltip on top">
                            <i class="bi-check-circle" />
                        </button>
                    </div>
                </template>
            </VColumn>
        </VTableServer>
    </div>
</template>

<script>
import VColumn from '@/components/data-table/VColumn.vue';
import VTableServer from '@/components/data-table/VTableServer.vue';
import { useFetchComments } from '@/composables/comments.composable';
import { watch } from 'vue';

export default {
    name: 'CommentsView',
    setup() {
        const { comments, commentsIsLoading, fetchComments } = useFetchComments()

        function fetch() {
            const config = {}
            return fetchComments(config)
        }
        fetch()
        watch([], () => fetchComments())

       
        return {
            comments,
            commentsIsLoading
        }
    },
    components: {
        VTableServer,
        VColumn
    }
}
</script>
