<template>
    <div class="toast-container bottom-0 end-0">
        <div
            v-for="item of items"
            :key="item.id"
            :class="`toast show align-items-center border-1 m-2 fw-medium text-bg-${item.theme}`"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div class="toast-header" v-html="item.title" v-if="!!item.title"></div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="toast-body" v-html="item.body"></div>
                <button
                    v-if="item.clearable"
                    type="button"
                    class="btn-close p-3"
                    aria-label="Close"
                    @click="hideToast(item.id)"
                ></button>
            </div>
        </div>
    </div>
</template>

<script>
    // Composables
    import { installToast, useToast } from '@/composables/toast.composable';

    export default {
        name: 'VToasts',
        setup() {
            let items = installToast();

            const { hideToast } = useToast();

            return {
                items,

                hideToast,
            };
        }
    }
</script>
