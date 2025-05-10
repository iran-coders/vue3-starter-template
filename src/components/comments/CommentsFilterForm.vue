<script>
import { useModelRef } from '@/composables/model.composable';
import VForm from '../form/VForm.vue';
import VInput from '../form/VInput.vue';
import { t } from '@/services/language.service';
export default {
    name: 'CommentsFilterForm',
    setup() {


     const filters = useModelRef('modelValue');        

        const statusItems = [
            {
                key:'PENDING',
                text:t('Pending')
            },
            {
                key:'REJECTED',
                text:t('Rejected')
            },
            {
                key:'CONFIRMED',
                text:t('Confirmed')
            }
        ]

        return {
            filters,
            statusItems
        }
    },
    components: {
        VForm,
        VInput
    },
    emits: ['update:modelValue'],

}
</script>

<template>
    <VForm class="flex">
        <div class="col-3">
            <VInput v-model="filters.searchQuery" :placeholder="$t('SearchInputPlaceholder')" id="searchQuery" />
        </div>
    </VForm>
</template>
