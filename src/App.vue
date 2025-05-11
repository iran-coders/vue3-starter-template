<template>
    <RouterView />
    <VToasts />
    <CustomToast />
</template>

<script>
// Components
import VToasts from '@/components/VToasts.vue';
import CustomToast from './components/comments/CustomToast.vue';

export default {
    name: 'App',

    components: { VToasts, CustomToast }
};
</script>
