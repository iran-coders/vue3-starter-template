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
            <div class="toast-body" v-html="item.body"></div>
            <button
                type="button"
                class="text-grey bg-transparent border-0 text-decoration-none"
                @click="confirm(item)"
            >
                {{ $t('Confirm') }}
            </button>

            <button
                type="button"
                class="bg-danger border-0 text-decoration-none text-white me-2 rounded-1"
                @click="cancel(item)"
            >
                {{ $t('Cancel') }}
            </button>
        </div>
    </div>
</div>
</template>

<script>
// Composables
import { installPopup, usePopup } from "@/composables/popup.composable";

export default {
    name: "VPopup",

    setup() {
        let items = installPopup();

        const { hidePopup, cancel, confirm } = usePopup();

        return {
            items,
            hidePopup,
            confirm,
            cancel
        };
    },
};
</script>
