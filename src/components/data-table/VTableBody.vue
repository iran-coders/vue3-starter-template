<template>
    <tbody>
        <tr v-if="isLoading && items.length === 0" class="text-center">
            <td :colspan="columns.length" class="text-muted text-center">{{ $t('Loading') }}...</td>
        </tr>

        <tr v-else-if="items.length === 0" class="text-center">
            <td :colspan="columns.length" class="text-muted">{{ $t('No data available') }}</td>
        </tr>

        <template v-else-if="rowSlot">
            <component
                :is="rowSlot"
                v-for="(item, rowIndex) of items"
                :key="rowIndex"
                :columns="renderColumns(item, rowIndex)"
                :item="item"
                :rowIndex="rowIndex"
                :class="{ 'border-bottom': isMobile }"
            />
        </template>

        <template v-else>
            <tr
                v-for="(item, rowIndex) of items"
                :key="rowIndex"
                :class="{ 'border-bottom': isMobile }"
            >
                <component
                    :is="column"
                    v-for="(column, index) of renderColumns(item ,rowIndex)"
                    :key="index"
                />
            </tr>
        </template>
    </tbody>
</template>

<script>
    import { h } from 'vue';

    // Utils
    import { hasVNodeSlot } from '@/utils/vue';
    import Breakpoints from '@/utils/breakpoints';

    export default {
        name: 'VTableBody',

        props: {
            columns: {
                type: Array,
                required: true
            },
            items: {
                type: Array,
                required: true
            },
            rowSlot: {
                type: Function
            },
            isLoading: {
                type: Boolean,
                default: false
            }
        },

        setup(props) {
            const isMobile = Breakpoints.down(Breakpoints.SM);

            function renderColumns(item, rowIndex) {
                return props.columns.map(function (column) {
                    let content;
                    let title;

                    if (hasVNodeSlot(column, 'body')) {
                        content = h(column.children.body, { field: column.props.field, item, rowIndex });
                    } else {
                        content = resolveField(column, item);
                    }

                    if (hasVNodeSlot(column, 'header') && isMobile) {
                        title = h(column.children.header, { field: column.props.field, item, rowIndex });
                    } else if (isMobile){
                        title = column.props.header;
                    }

                    if (isMobile) {
                        return h(
                            "td",
                            { class: "d-flex justify-content-between align-items-center border-bottom-0" },
                            [
                                h(
                                "div",
                                { class: "fs-3 bg-transparent fw-medium" },
                                title
                                ),
                                h(
                                "div",
                                { class: "fs-3 bg-transparent" },
                                content
                                )
                            ]
                        );
                    }

                    return h(
                        "td",
                        { class: "bg-transparent" },
                        content
                    );
                });
            }

            function resolveField(column, item) {
                if (column.props.field === null) {
                    return item;
                }

                if (typeof column.props.field === 'string') {
                    return item[column.props.field];
                }

                return column.props.field(item);
            }

            return {
                renderColumns,

                isMobile
            };
        }
    };
</script>
