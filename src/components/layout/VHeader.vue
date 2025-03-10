<template>
    <header class="header d-flex align-items-center bg-primary px-2">
        <button
            type="submit"
            class="btn btn-sm text-white"
            @click="toggleSideMenu"
        >
            <i class="bi-list h4"></i>
        </button>

        <div class="px-2">
            <slot name="start">
                <div class="h5 text-white mb-0">Eghamat24</div>
            </slot>
        </div>

        <div class="ms-auto">
            <slot name="end"></slot>

            <AppSettings />

            <button
                type="button"
                class="btn btn-sm text-white"
                @click="logout"
            >
                <i class="bi-power h4"></i>
            </button>
        </div>
    </header>
</template>

<script>
    import { useRouter } from 'vue-router';

    // Components
    import AppSettings from '@/components/layout/AppSettings.vue';

    // Services
    import AuthenticationService from '@/services/authentication.service';

    export default {
        name: 'VHeader',

        components: {
            AppSettings
        },
        props: {
            wide: {
                type: Boolean
            },
        },
        emits: ['update:wide'],
        setup(props, { emit }) {
            const router = useRouter();

            function logout() {
                AuthenticationService.logout();
                router.push({ name: 'Login' });
            }

            function toggleSideMenu() {
                emit('update:wide', !props.wide);
            }
            return {
                logout,
                toggleSideMenu
            };
        }
    }
</script>
