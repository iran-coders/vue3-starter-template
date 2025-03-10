<template>
    <aside v-if="wide" class="col-2 border-end">
        <nav class="list-group list-group-flush py-2">
            <VSideMenuItem :to="{ name: 'Dashboard' }">
                <template #icon>
                    <i class="bi-border-all"></i>
                </template>

                {{ $t('Dashboard') }}
            </VSideMenuItem>

            <VSideMenuItem :to="{ name: 'Users' }">
                <template #icon>
                    <i class="bi-people"></i>
                </template>

                {{ $t('Users') }}
            </VSideMenuItem>

            <VSideMenuItem :to="{ name: 'Todos' }">
                <template #icon>
                    <i class="bi-list-task"></i>
                </template>

                {{ $t('Todos') }}
            </VSideMenuItem>
        </nav>
    </aside>

    <aside v-else class="list-group-minimize border-end">
        <nav class="list-group list-group-flush py-2">
            <VSideMenuItem :to="{ name: 'Dashboard' }">
                <template #icon>
                    <i class="bi-border-all"></i>
                </template>

            </VSideMenuItem>

            <VSideMenuItem :to="{ name: 'Users' }">
                <template #icon>
                    <i class="bi-people"></i>
                </template>

            </VSideMenuItem>

            <VSideMenuItem :to="{ name: 'Todos' }">
                <template #icon>
                    <i class="bi-list-task"></i>
                </template>

            </VSideMenuItem>
        </nav>
    </aside>
</template>

<script>
    // Components
    import VSideMenuItem from '@/components/layout/side-menu/VSideMenuItem.vue';

    export default {
        name: 'VSideBar',
        props: {
            wide: {
                type: Boolean
            },
        },
        components: {
            VSideMenuItem
        }
    }
</script>
