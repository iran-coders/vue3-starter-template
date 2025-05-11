<template>
    <div class="h3 mb-4">{{ $t('Comments') }}</div>
    <CommentsFilterForm class="mb-4" v-model="filters" />
    <VTableServer :items="comments" :itemsLength="comments.length" :is-loading="commentsIsLoading">
        <VColumn :header="$t('Id')" field="id">
            <template #body="{ item }">
                <span v-html="highlightText(item.id)" />
            </template>
        </VColumn>
        <VColumn :header="$t('Name')" field="name">
            <template #body="{ item }">
                <span v-html="highlightText(item.name)" />
            </template>
        </VColumn>
        <VColumn :header="$t('Email')" field="email" />
        <VColumn :header="$t('Post')" field="postId">
            <template #body>
                <button class="btn btn-sm btn-outline-info" title="View Related Post">
                    <i class="bi-eye" />
                </button>
            </template>
        </VColumn>
        <VColumn :header="$t('Text')" field="body">
            <template #body="{ item }">
                <span v-html="highlightText(item.body)" />
            </template>
        </VColumn>
        <VColumn :header="$t('Status')" field="id">
            <template #body="{ item }">
                <span v-if="item.status === 'PENDING'">
                    {{ $t('Pending') }}
                </span>
                <span v-if="item.status === 'CONFIRMED'">
                    {{ $t('Confirmed') }}
                </span>
                <span v-if="item.status === 'REJECTED'">
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
</template>

<script>
import CommentsFilterForm from '@/components/comments/CommentsFilterForm.vue';
import VColumn from '@/components/data-table/VColumn.vue';
import VTableServer from '@/components/data-table/VTableServer.vue';
import { useFetchComments } from '@/composables/comments.composable';
import { useApplyFilters } from '@/composables/filter.composable';
import { computed } from 'vue';

export default {
    name: 'CommentsView',
    setup() {
        const { comments, commentsIsLoading, fetchComments } = useFetchComments()

        fetchComments({})

        const filters = useApplyFilters({
            searchQuery: undefined,
            status: undefined,
            email: undefined
        });

        const filteredComments = computed(() => {
            const enteredEmail = filters?.email && filters.email.trim().toLowerCase();
            const query = filters?.searchQuery && isNaN(Number(filters.searchQuery)) ? filters.searchQuery.trim().toLowerCase() : filters.searchQuery;
            const status = filters?.status && filters.status.trim();

            const matchesEmail = (email) => enteredEmail && email.trim().toLowerCase().includes(enteredEmail)
            const matchesQuery = (id, body, name) => id === Number(query) || body.trim().toLowerCase().includes(query) || name.trim().toLowerCase().includes(query)

            return comments.value?.filter(comment => {
                if (!query && !enteredEmail && !status) return true;
                return matchesEmail(comment.email) || matchesQuery(comment.id, comment.body, comment.name) || status === comment.status;
            });
        });

        const highlightText = (text) => {
            const query = filters?.searchQuery && isNaN(Number(filters.searchQuery)) ? filters.searchQuery.trim().toLowerCase() : undefined;
            
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return String(text).replace(regex, '<mark>$1</mark>');

        }
        
        return {
            comments: filteredComments,
            commentsIsLoading,
            filters,
            highlightText
        }
    },
    components: {
        VTableServer,
        VColumn,
        CommentsFilterForm
    }
}
</script>
