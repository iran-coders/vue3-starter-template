<template>
    <aside class="col-2 border-end">
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

            <VSideMenuItem :to="{ name: 'Todos-Test' }">
                <template #icon>
                    <i class="bi bi-check2-square"></i>
                </template>

                {{ $t('Todos Test') }}
            </VSideMenuItem>

            <VSideMenuItem :to="{ name: 'comments' }">
                <template #icon>
                    <i class="bi bi-chat-left-text"></i>
                </template>

                {{ $t('comments') }}
            </VSideMenuItem>
        </nav>
    </aside>
</template>

<script>
    // Components
    import VSideMenuItem from '@/components/layout/side-menu/VSideMenuItem.vue';

    export default {
        name: 'VSideBar',

        components: {
            VSideMenuItem
        }
    }
</script>
