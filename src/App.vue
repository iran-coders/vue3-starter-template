<template>
    <RouterView />
    <VToasts/>
    <VPopup />
</template>

<script>
    // Components
    import VToasts from '@/components/VToasts.vue';
    import VPopup from "@/components/VPopup.vue";

    export default {
        name: 'App',

        components: {VPopup, VToasts }
    };
</script>
