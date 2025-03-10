<template>
    <div>
        <label v-if="$slots.label" class="form-label" :for="id">
            <slot name="label"></slot>
        </label>

        <div ref="container" :class="inputGroupClassNames">
            <div class="d-flex align-items-center">
                <input
                    :value="selectedItem?.text"
                    readonly
                    :id="id"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :class="inputClassNames"
                    @click="toggleMenu"
                >

                <button
                    v-if="clearable && !isEmpty(modelValue)"
                    @click="clear"
                    class="form-select-clear btn-close"
                />
            </div>

            <ul :class="menuClassNames" style="max-height: 210px;">
                <li
                    v-if="isLoading"
                    class="dropdown-item"
                >{{ $t('Loading') }}...</li>

                <li
                    v-else-if="items.length === 0"
                    class="dropdown-item"
                >{{ $t('No data available') }}</li>

                <template v-else>
                    <li
                        v-for="(item, index) in paginatedItems"
                        :class="['dropdown-item text-truncate', { 'active': item.value === modelValue }]"
                        :key="index"
                        role="option"
                        @click="selectItem(item)"
                    >
                        <slot
                            name="item"
                            :item="item.raw"
                            :value="item.value"
                            :text="item.text"
                        >{{ item.text }}</slot>
                    </li>

                    <VLazyLoadHelper tag="li" @reach="addFilteredItems"/>
                </template>
            </ul>

            <div v-if="errors.length !== 0" class="invalid-text">{{ errors[0] }}</div>
        </div>
    </div>
</template>

<script>
    import { ref, computed, watch } from 'vue';

    // Utils
    import { isEmpty, getUniqueId, resolveIteratee } from '@/utils';

    // Components
    import VLazyLoadHelper from '@/components/VLazyLoadHelper.vue';

    // Composables
    import { useRegisterFormValidator } from '@/composables/validatation.composable';
    import { onClickOutside } from '@/composables/click.composable';

    // Enums
    import ComponentSize from '@/enums/ComponentSize';

    export default {
        name: 'VSelect',

        components: {
            VLazyLoadHelper
        },

        props: {
            modelValue: {
                required: true
            },
            id: {
                type: String,
                default: () => getUniqueId()
            },
            placeholder: {
                type: String,
                default: null
            },
            disabled: {
                type: Boolean,
                default: false
            },
            isLoading: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: null,
                validator(value) {
                    return [ComponentSize.SM, ComponentSize.LG].includes(value);
                }
            },
            items: {
                type: Array,
                required: true
            },
            itemKey: {
                type: [Function, String],
                default: null
            },
            itemText: {
                type: [Function, String],
                default: null
            },
            clearable: {
                type: Boolean,
                default: false
            },
            rules: {
                type: Array,
                default: () => []
            }
        },

        emits: ['update:modelValue'],

        setup(props, { emit }) {
            const { errors, isValid, validate } = useRegisterFormValidator();

            const isShowMenu = ref(false);

            function showMenu() {
                isShowMenu.value = true;
            }

            function hideMenu() {
                isShowMenu.value = false;
            }

            const inputGroupClassNames = computed(() => {
                return {
                    'position-relative': true,
                    [`input-group-${props.size}`]: props.size
                };
            });
            const inputClassNames = computed(() => {
                return {
                    'form-select': true,
                    'is-invalid': isValid.value === false
                };
            });
            const menuClassNames = computed(() => {
                return {
                    'dropdown-menu w-100 overflow-y-auto overflow-x-hidden mt-1': true,
                    'show': isShowMenu.value
                };
            });

            const resolveItemKey = resolveIteratee(props.itemKey);
            const resolveItemText = resolveIteratee(props.itemText);

            const paginatedItems = ref([]);
            const itemsPerPage = 10;
            let lastIndex = -1;

            function addPaginatedItems() {
                let count = 0;
                let index;

                for (index = lastIndex + 1; index < props.items.length; index++) {
                    const item = props.items[index];
                    const text = resolveItemText(item);

                    paginatedItems.value.push({
                        raw: item,
                        value: resolveItemKey(item),
                        text: text
                    });

                    count++;

                    if (count === itemsPerPage) {
                        break;
                    }
                }

                lastIndex = index;
            }

            function resetPaginatedItems() {
                lastIndex = -1;
                paginatedItems.value = [];

                addPaginatedItems();
            }

            watch(() => props.items, () => resetPaginatedItems());

            const selectedItem = ref(undefined);

            function selectItem(item) {
                selectedItem.value = item;

                emit('update:modelValue', item.value);

                hideMenu();
                validate();
            }

            function syncWithModelValue() {
                if (selectedItem.value !== undefined && selectedItem.value.value === props.modelValue) {
                    return;
                }

                const selectedRawItem = props.items.find(function (item) {
                    const value = resolveItemKey(item);
                    return props.modelValue === value;
                });

                if (selectedRawItem === undefined) {
                    return;
                }

                selectedItem.value = {
                    raw: selectedRawItem,
                    value: props.modelValue,
                    text: resolveItemText(selectedRawItem)
                };
            }

            watch(
                [
                    () => props.modelValue,
                    () => props.items
                ],
                function () {
                    resetPaginatedItems();

                    if (!isEmpty(props.modelValue)) {
                        syncWithModelValue();
                    }
                },
                { immediate: true }
            );

            const container = ref();

            function onFocus() {
                const { off } = onClickOutside(container, function () {
                    hideMenu();
                    validate();
                    off();
                });
            }

            function toggleMenu() {
                if (isShowMenu.value) {
                    hideMenu();
                } else {
                    showMenu();
                    onFocus();
                }
            }
            function clear() {
                selectedItem.value = undefined;
                emit('update:modelValue', undefined);
            }

            return {
                isEmpty,

                errors,

                inputGroupClassNames,
                inputClassNames,
                menuClassNames,

                isShowMenu,
                toggleMenu,
                paginatedItems,
                addFilteredItems: addPaginatedItems,

                selectedItem,
                selectItem,

                container,
                onFocus,

                clear
            };
        }
    };
</script>
