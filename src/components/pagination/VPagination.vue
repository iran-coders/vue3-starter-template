<template>
<div class="d-flex align-items-center justify-content-center py-2">
    <button
        class="arrow bg-primary-subtle d-flex align-items-center justify-content-center"
        @click="goPrev"
        :disabled="modelValue === 1"
    >
        <i class="bi bi-arrow-left"></i>
    </button>
        <button
            v-for="number in visiblePageNumbers"
            :key="number"
            class="page-number bg-primary-subtle d-flex align-items-center justify-content-center"
            @click="goToPage(number)"
            :class="{ 'active': modelValue === number }"
        >
            {{ number }}
        </button>

    <button
        class="arrow bg-primary-subtle d-flex align-items-center justify-content-center border-0"
        @click="goNext"
        :disabled="modelValue === count"
    >
        <i class="bi bi-arrow-right"></i>
    </button>

    <span class="small text-muted ms-5 me-2">{{ $t('Size') }}:</span>

    <select
        :value="size"
        @input="updateSize($event.target.value)"
        class="form-select form-select-sm"
        style="width: 70px;"
    >
        <option
            v-for="option in sizeOptions"
            :key="option"
            :value="option"
        >{{ option }}</option>
    </select>
</div>
</template>

<script>
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'VPagination',

    props: {
        modelValue: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        numbersCount: {
            type: Number,
            default: 5
        },
        size: {
            type: Number,
            default: 10
        },
        sizeOptions: {
            type: Array,
            default: () => [5, 10, 50, 100]
        }
    },

    emits: ['update:modelValue', 'update:size'],

    setup(props, context) {
        const route = useRoute();
        const router = useRouter();

        const count = computed(() => Math.ceil(props.total / props.size));
        const currentInSightNumbers = ref([1, props.numbersCount]);


        const visiblePageNumbers = computed(() => {
            if (count.value <= props.numbersCount) {
                return Array.from({ length: count.value }, (_, i) => i + 1);
            } else {
                const [start, end] = currentInSightNumbers.value;
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            }
        });

        // watches count and if it changes (by changing size) currentInSightNumbers re-fetches. So the visible numbers change
        watch(count, () => {
            currentInSightNumbers.value = [1, props.numbersCount];
        }, { immediate: true });

        watch(() => props.modelValue, (newPage) => {
            if (count.value <= props.numbersCount) return;
            const [start, end] = currentInSightNumbers.value;

            if (newPage < start) {
                // newPage - props.numbersCount - 1 : fetches the end number going backward (before the current visible start number)
                currentInSightNumbers.value = [newPage, newPage + props.numbersCount - 1];
            } else if (newPage > end) {
                // newPage - props.numbersCount + 1 : fetches the start number going forward (after the current visible end number)
                currentInSightNumbers.value = [newPage - props.numbersCount + 1, newPage];
            }
        });

        function updateValue(value) {
            value = Number(value);

            if (value < 1) {
                value = 1;
            }

            if (value > count.value) {
                value = count.value;
            }

            context.emit('update:modelValue', value);
            router.push({ query: { ...route.query, page: value } });
        }

        function goNext() {
            updateValue(props.modelValue + 1);
        }

        function goPrev() {
            updateValue(props.modelValue - 1);
        }

        function goToPage(page) {
            updateValue(page);
        }

        function updateSize(value) {
            context.emit('update:size', Number(value));
            context.emit('update:modelValue', 1);
            router.push({ query: { ...route.query, items_per_page: value, page: 1 } });
        }

        onMounted(() => {
            const currentPageBySize = +route.query.page > +count.value ? 1 : +route.query.page;
            const pageFromUrl = currentPageBySize;
            const sizeFromUrl = Number(route.query.items_per_page) || props.size;

            context.emit('update:modelValue', pageFromUrl);
            context.emit('update:size', sizeFromUrl);

            if (pageFromUrl > count.value) {
                // start: 1, end: 5
                currentInSightNumbers.value = [1, props.numbersCount];
            } else {
                const start = Math.max(1, pageFromUrl - Math.floor(props.numbersCount / 2));
                const end = Math.min(count.value, start + props.numbersCount - 1);
                currentInSightNumbers.value = [start, end];
            }
        });

        return {
            count,
            visiblePageNumbers,
            goToPage,
            updateValue,
            goPrev,
            goNext,
            updateSize
        };
    }
}
</script>

<style lang="scss">
.change-page {
    border: none;
    border-right: 1px solid #cccccc88;
    width: 1.5rem;
    aspect-ratio: 1/1;
    transition: background-color, color, .08s ease;

    &:disabled {
        background-color: #cfe2ff66 !important;
        pointer-events: none;
    }

    &:hover {
        background-color: #a8c7f5 !important;
    }

    &:active {
        background-color: #699be6 !important;
        color: #fff;
    }

    &.active {
        background-color: #699be6 !important;
        color: #fff;
    }
}

.arrow {
    @extend .change-page
}

.page-number {
    @extend .change-page;


}
</style>
