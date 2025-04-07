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
import { computed } from 'vue';

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
        const count = computed(() => Math.ceil(props.total / props.size));

        const visiblePageNumbers = computed(() => {
            const totalPages = count.value;
            const currentPage = props.modelValue;
            const maxVisibleButtons = props.numbersCount;

            if (totalPages <= maxVisibleButtons) {
                return Array.from({ length: totalPages }, (_, i) => i + 1);
            }

            let startPage = currentPage - Math.floor(maxVisibleButtons / 2) > 1 ? currentPage - Math.floor(maxVisibleButtons / 2) : 1;
            let endPage = startPage + maxVisibleButtons - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = endPage - maxVisibleButtons + 1 ? endPage - maxVisibleButtons + 1 : 1;
            }
            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

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
        }

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
