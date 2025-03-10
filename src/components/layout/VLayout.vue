<template>
    <slot name="header">
        <VHeader  v-model:wide="wide"/>
    </slot>

    <main class="row g-0 flex-fill">
        <slot name="side-bar">
            <VSideMenu :wide="wide" />
        </slot>

        <div class="col bg-body-tertiary p-4">
            <slot>Content</slot>
        </div>
    </main>

    <slot name="footer">
        <VFooter />
    </slot>
</template>

<script>
    // Components
    import VHeader from '@/components/layout/VHeader.vue';
    import VFooter from '@/components/layout/VFooter.vue';
    import VSideMenu from '@/components/layout/side-menu/VSideMenu.vue';

    import { ref } from "vue";

    export default {
        components: {
            VHeader,
            VSideMenu,
            VFooter
        },
        setup() {
            const wide = ref(true);
            return {
                wide
            };
        }
    }
</script>
