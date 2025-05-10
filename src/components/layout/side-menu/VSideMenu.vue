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
            <VSideMenuItem :to="{ name: 'Comments' }">
                <template #icon>
                    <i class="bi-chat-dots-fill"></i>
                </template>
                {{ $t('Comments') }}
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
