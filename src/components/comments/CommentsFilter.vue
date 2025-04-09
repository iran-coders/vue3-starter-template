<template>
<VForm class="row">
    <div class="col-3">
        <VInput
            v-model="filters.id"
            :placeholder="$t('Filter by Body or Id')"
        >
            <template #label>{{ $t('Search') }}</template>
        </VInput>
    </div>

    <div class="col-3">
        <!--            <VAutoComplete-->
        <!--                v-model="filters.length"-->
        <!--                :items="commentttt.comments"-->
        <!--                :is-loading="commentStore.isLoading"-->
        <!--                item-key="id"-->
        <!--                item-text="name"-->
        <!--                :placeholder="$t('Filter by body length')"-->
        <!--                clearable-->
        <!--            >-->
        <!--                <template #label>{{ $t('Body Length') }}</template>-->
        <!--            </VAutoComplete>-->
        <VSelect
            v-model="filters.length"
            :items="textLength"
            item-key="key"
            item-text="text"
            :placeholder="$t('Filter by status')"
            clearable
        >
            <template #label>{{ $t('Body Length') }}</template>
        </VSelect>
    </div>

    <div class="col-3">
        <VSelect
            v-model="filters.status"
            :items="statusItems"
            item-key="key"
            item-text="text"
            :placeholder="$t('Filter by status')"
            clearable
        >
            <template #label>{{ $t('Status') }}</template>
        </VSelect>
    </div>
</VForm>
</template>

<script setup>
// Components
import VForm from '@/components/form/VForm.vue';
import VInput from '@/components/form/VInput.vue';
import VAutoComplete from '@/components/form/VAutoComplete.vue';
import VSelect from '@/components/form/VSelect.vue';

// Stores
import {useUserStore} from '@/stores/user.store';

// Composables
import {useModelRef} from "@/composables/model.composable";

// Services
import {t} from '@/services/language.service';
import {useCommentsStore} from "@/stores/comments.store";
import {useTodoStore} from "@/stores/todo.store";
import {onMounted, watch} from "vue";

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(["update:modelValue"]);


const filters = useModelRef('modelValue');

const statusItems = [
    {
        key: 'pending',
        text: t('Pending')
    },
    {
        key: 'confirmed',
        text: t('Confirmed')
    },
    {
        key: 'rejected',
        text: t('Rejected')
    }
];

const textLength = [
    {
        key: 150,
        text: t('150 characters')
    },
    {
        key: 170,
        text: t('170 characters')
    },
    {
        key: 200,
        text: t('200 characters or more')
    }
];

const commentsStore = useCommentsStore();

// const commentStore = useTodoStore();
onMounted(() => {
    commentsStore.fetchComments();

})

</script>
