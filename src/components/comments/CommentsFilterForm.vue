<script>
import { useModelRef } from '@/composables/model.composable';
import VForm from '../form/VForm.vue';
import VInput from '../form/VInput.vue';
import { t } from '@/services/language.service';
import VSelect from '../form/VSelect.vue';
export default {
    name: 'CommentsFilterForm',
    setup() {


        const filters = useModelRef('modelValue');

        const statusItems = [
            {
                key: 'PENDING',
                text: t('Pending')
            },
            {
                key: 'REJECTED',
                text: t('Rejected')
            },
            {
                key: 'CONFIRMED',
                text: t('Confirmed')
            }
        ]

        return {
            filters,
            statusItems
        }
    },
    props: {
        modelValue: {
            type: Object,
            required: true
        }
    },
    components: {
        VForm,
        VInput,
        VSelect
    },
    emits: ['update:modelValue'],

}
</script>

<template>
    <VForm class="row">
        <div class="col-3">
            <VInput v-model="filters.searchQuery" :placeholder="$t('SearchInputPlaceholder')" id="searchQuery" />
        </div>
        <div class="col-3">
            <VInput v-model="filters.email" :placeholder="$t('EmailPlaceholder')" />
        </div>
        <div class="col-2">
            <VSelect v-model="filters.status" :items="statusItems" item-key="key" item-text="text"
                :placeholder="$t('Filter by status')" clearable />
        </div>
    </VForm>
</template>
