<template>
    <div class="h3 mb-4">{{ $t("comments") }}</div>

    <CommentsFilter v-model="filters" class="mb-4" />

    <VTable :items-length="500" :items="commentsStore.comments || []" :is-loading="commentsStore.isLoading" :hasPagination="false">
        <template #row="{ item, columns }">
            <tr>
                <component :is="column" v-for="(column, index) of columns" :key="index" />
            </tr>
        </template>
        <VColumn :header="$t('Id')" field="id"></VColumn>
        <VColumn :header="$t('Body')" field="body"></VColumn>
        <VColumn :header="$t('Status')" field="confirmed">
            <template #body="{ item }">
                <span v-if="item.status === 'pending'" class="d-flex">
                    <i class="bi bi-hourglass text-primary"></i>
                    {{ $t("Pending") }}
                </span>

                <span v-else-if="item.status === 'confirmed'" class="d-flex">
                    <i class="bi-check-circle-fill text-success me-1"></i>
                    {{ $t("Confirmed") }}
                </span>

                <span v-else class="d-flex">
                    <i class="bi-dash-circle text-danger me-1"></i>
                    {{ $t("Rejected") }}
                </span>
            </template>
        </VColumn>
        <VColumn :header="$t('Actions')">
            <template #body="{ item }">
<!--              {{console.log('item', item)}}-->
                <div class="d-flex">
                    <VTooltip position="start" theme="secondary">
                        <template #activator="{ on }">
                            <button class="border-0 bg-transparent btn-sm" @click="showInfo(item)">
                                <i class="bi bi-eye-fill text-muted" v-on="on"></i>
                            </button>
                        </template>
                        <span>{{ $t("Show information") }}</span>
                    </VTooltip>

                    <VModal v-if="selectedItem && (selectedItem.id === item.id)" v-model:modelValue="showInfoModal" size="xl">
                      <template #title>
                        <h3 class="fs-3">
                          {{ commentModalTitleText(item) }}
                        </h3>
                      </template>
                      <template #default>
                        <div class="d-flex justify-content-between gap-2">
                          <div>
                              <h4 class="fs-4">Comment Info: </h4>
                            <p>
                              <strong>{{ $t("Body") }}:</strong> {{ item.body }}
                            </p>
                            <p>
                              <strong>{{ $t("Email") }}:</strong> {{ item.email }}
                            </p>
                            <p>
                              <strong>{{ $t("Status") }}:</strong> {{ item.status }}
                            </p>
                          </div>

                          <div>
                              <h4 class="fs-4">Post Info: </h4>
                            <p>
                              <strong>{{ $t("Title") }}:</strong> {{ relatedPost.title }}
                            </p>
                            <p>
                              <strong>{{ $t("Body") }}:</strong> {{ relatedPost.body }}
                            </p>
                          </div>
                        </div>

                      </template>

                    </VModal>

                    <VTooltip position="start" theme="success">
                        <template #activator="{ on }">
                            <button
                                :disabled="item.status === 'confirmed'"
                                class="border-0 bg-transparent btn-sm"
                                v-on="on"
                                @click="confirm(item)"
                            >
                                <i class="bi bi-check-square text-success" :class="{ 'opacity-25': item.status === 'confirmed' }"></i>
                            </button>
                        </template>
                        <span>{{ $t("Confirm") }}</span>
                    </VTooltip>

                    <VTooltip position="start" theme="danger">
                        <template #activator="{ on }">
                            <button
                                :disabled="item.status === 'rejected'"
                                class="border-0 bg-transparent btn-sm"
                                v-on="on"
                                @click="reject(item)"
                            >
                                <i class="bi-dash-square text-danger me-1" :class="{ 'opacity-50': item.status === 'rejected' }"></i>
                            </button>
                        </template>
                        <span>{{ $t("Reject") }}</span>
                    </VTooltip>
                </div>
            </template>
        </VColumn>
    </VTable>
</template>

<script setup>
import useComments from "@/composables/comments/comments.composable";
import VTable from "@/components/data-table/VTable.vue";
import VColumn from "@/components/data-table/VColumn.vue";
import CommentsFilter from "@/components/comments/CommentsFilter.vue";
import { onMounted, watch } from "vue";
import { useApplyFilters } from "@/composables/filter.composable";
import VTooltip from "@/components/VTooltip.vue";
import VModal from "@/components/VModal.vue";

const filters = useApplyFilters({
    id: undefined,
    length: undefined,
    status: undefined,
});

onMounted(() => {
    commentsStore.fetchComments(filters);
});

watch(filters, () => commentsStore.fetchComments(filters));

const { commentsStore, confirm, reject, showInfo, showInfoModal, relatedPost, commentModalTitleText, selectedItem } = useComments();
</script>
