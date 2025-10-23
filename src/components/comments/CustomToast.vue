<template>
    <div class="toast-container bottom-0 end-0">
        <div v-for="item of items" :key="item.id"
            :class="`toast show align-items-center border-1 m-2 fw-medium text-bg-${item.theme}`" role="alert"
            aria-live="assertive" aria-atomic="true">
            <div class="toast-header" v-html="item.title" v-if="!!item.title"></div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="toast-body">
                    <button @click="handleCallbackCall(item.id,item.callback)" class="btn btn-secondary">
                        Undo
                    </button>
                </div>
                <button v-if="item.clearable" type="button" class="btn-close p-3" aria-label="Close"
                    @click="hideToast(item.id)"></button>
            </div>
        </div>
    </div>
</template>

<script>
import { installCustomToast, useCustomToast } from '@/composables/customToast.composable';

export default {
    name: 'CustomToast',
    setup() {
        let items = installCustomToast();

        const { hideToast } = useCustomToast();
        const handleCallbackCall = (id,callback) => {
            callback?.()
            hideToast(id)
        }

        return {
            items,
            hideToast,
            handleCallbackCall
        };
    },
}
</script>
