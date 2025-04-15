<template>
    <div class="position-fixed bottom-0 end-0">
        <div
            v-for="item of items"
            :key="item.id"
            :class="`toast show align-items-center border-1 m-2 fw-medium text-bg-${item.theme}`"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div class="d-flex justify-content-between align-items-center">
                <div v-if="item.timer" class="ps-2 d-flex gap-1 flex-wrap align-items-center">
                    <div class="timer">{{ String(Math.ceil(item.timer / 1000)).padStart(2, 0) }}</div>
                    <div class="toast-body" v-html="item.body"></div>
                </div>
                <div v-else class="toast-body" v-html="item.body"></div>
                <button
                    v-if="item.undoAction"
                    type="button"
                    class="bg-transparent border-0 btn-link text-decoration-none text-info"
                    @click="undo(item)"
                >
                    Undo
                </button>
                <button v-if="item.clearable" type="button" class="btn-close p-3" aria-label="Close" @click="hideToast(item.id)"></button>
            </div>
        </div>
    </div>
</template>

<script>
// Composables
import { installToast, useToast } from "@/composables/toast.composable";

export default {
    name: "VToasts",

    setup() {
        let items = installToast();

        const { hideToast, undo } = useToast();

        return {
            items,
            undo,
            hideToast,
        };
    },
};
</script>
