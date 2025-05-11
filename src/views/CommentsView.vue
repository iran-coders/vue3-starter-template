<template>
    <div class="h3 mb-4">{{ $t("Comments") }}</div>
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
            <template #body="{ item }">
                <button class="btn btn-sm btn-outline-info" title="View Related Post"
                    @click="handleFetchPost(item.postId)">
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
                    {{ $t("Pending") }}
                </span>
                <span v-if="item.status === 'CONFIRMED'">
                    {{ $t("Confirmed") }}
                </span>
                <span v-if="item.status === 'REJECTED'">
                    {{ $t("Rejected") }}
                </span>
            </template>
        </VColumn>
        <VColumn :header="$t('Actions')" field="id">
            <template #body="{ item }">
                <div class="d-flex gap-2">
                    <button class="btn btn-danger btn-sm" @click="handleRejectComment(item)">
                        <i class="bi-ban" />
                    </button>
                    <button class="btn btn-success btn-sm z-3" data-bs-toggle="tooltip" data-bs-placement="top" @click="handleConfirmComment(item.id)"
                        data-bs-title="Tooltip on top">
                        <i class="bi-check-circle" />
                    </button>
                </div>
            </template>
        </VColumn>
    </VTableServer>
    <VModal v-model="postModalIsOpen">
        <div v-if="postIsLoading">Loading...</div>
        <h1 v-if="!postIsLoading && post !== null">
            {{ post.title }}
        </h1>
    </VModal>
    <VModal v-model="rejectComment.modalIsOpen" ref="modal">
        <template v-slot:header>
            <h1 class="h6">Are you sure?</h1>
        </template>
        <div>
            <h3 class="text-danger">Attention</h3>
            <p>
                Changed Data can not be restored
            </p>
            <div>
                Post with id ({{ rejectComment?.comment?.id }}) will be rejected!!
            </div>
        </div>
        <template v-slot:footer>
            <button class="btn btn-danger" @click="handleConfirmRejection($refs.modal.hide)">
                Yes
            </button>
            <button class="btn btn-secondary" @click="$refs.modal.hide()">
                Cancel
            </button>
        </template>
    </VModal>
</template>

<script>
import CommentsFilterForm from "@/components/comments/CommentsFilterForm.vue";
import VColumn from "@/components/data-table/VColumn.vue";
import VTableServer from "@/components/data-table/VTableServer.vue";
import VModal from "@/components/VModal.vue";
import { useFetchComments } from "@/composables/comments.composable";
import { useApplyFilters } from "@/composables/filter.composable";
import useFetchPost from "@/composables/posts.composable";
import { useToast } from "@/composables/toast.composable";
import ThemeColor from "@/enums/ThemeColor";
import StorageService from "@/services/storage.service";
import { computed, reactive, ref, watch } from "vue";

export default {
    name: "CommentsView",
    setup() {
        const {  showToast } = useToast()

        const { comments, commentsIsLoading, fetchComments  , changeStatus: changeCommentStatus} = useFetchComments();
        fetchComments({});

        const { post, postIsLoading, fetchPost } = useFetchPost();
        const postModalIsOpen = ref(false);

        const rejectComment = reactive({
            comment: null,
            modalIsOpen: false,
        });

        const handleRejectComment = (rejectedComment) => {
            rejectComment.comment = rejectedComment;
            rejectComment.modalIsOpen = true;
        };
        const handleConfirmComment = (id)=>{
            changeCommentStatus(id,'CONFIRMED')
        }

        const handleFetchPost = async (id) => {
            try {
                postModalIsOpen.value = true;
                fetchPost(id).then(res => console.log("res", res)).catch(err => console.log("err", err));
            } catch {
                postModalIsOpen.value = false;
            }
        };

        const syncedFilters = StorageService.get("synced-filters");

        const filters = useApplyFilters({
            searchQuery: syncedFilters?.searchQuery || undefined,
            status: syncedFilters?.status || undefined,
            email: syncedFilters?.email || undefined,
        });

        watch(
            filters,
            (newFilters) => {
                StorageService.set("synced-filters", { ...filters, ...newFilters });
            },
            { immediate: true }
        );

        StorageService.observe("synced-filters", (newValue) => {
            filters.searchQuery = newValue?.searchQuery || undefined;
            filters.email = newValue?.email || undefined;
            filters.status = newValue?.status || undefined;
        });

        const filteredComments = computed(() => {
            const enteredEmail = filters?.email && filters.email.trim().toLowerCase();
            const query =
                filters?.searchQuery && isNaN(Number(filters.searchQuery)) ? filters.searchQuery.trim().toLowerCase() : filters.searchQuery;
            const status = filters?.status && filters.status.trim();

            const matchesEmail = (email) => enteredEmail && email.trim().toLowerCase().includes(enteredEmail);
            const matchesQuery = (id, body, name) =>
                id === Number(query) || body.trim().toLowerCase().includes(query) || name.trim().toLowerCase().includes(query);

            return comments.value?.filter((comment) => {
                if (!query && !enteredEmail && !status) return true;
                return matchesEmail(comment.email) || matchesQuery(comment.id, comment.body, comment.name) || status === comment.status;
            });
        });

        const highlightText = (text) => {
            const query = filters?.searchQuery && isNaN(Number(filters.searchQuery)) ? filters.searchQuery.trim().toLowerCase() : undefined;

            if (!query) return text;
            const regex = new RegExp(`(${query})`, "gi");
            return String(text).replace(regex, "<mark>$1</mark>");
        };

        const handleConfirmRejection = () => {
            changeCommentStatus(rejectComment.comment.id , "REJECTED")
            showToast({ body: "undo", theme: ThemeColor.WARNING, title: "Deleting", duration: 3000 })
            rejectComment.comment = null
            rejectComment.modalIsOpen = false
        }

        return {
            comments: filteredComments,
            commentsIsLoading,
            filters,
            highlightText,
            post,
            postIsLoading,
            handleFetchPost,
            postModalIsOpen,
            handleRejectComment,
            handleConfirmRejection,
            rejectComment,
            handleConfirmComment
        };
    },
    components: {
        VTableServer,
        VColumn,
        CommentsFilterForm,
        VModal,
    },
};
</script>
