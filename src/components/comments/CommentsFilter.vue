<template>
<VForm class="row">

        <div class="col-3">
            <VInput v-model="filters.id" :placeholder="$t('Filter by Body or Id')">
                <template #label>{{ $t("Search") }}</template>
            </VInput>
        </div>

        <div class="col-3">
            <VSelect
                v-model="filters.length"
                :items="textLength"
                item-key="key"
                item-text="text"
                :placeholder="$t('Filter by Body length')"
                clearable
            >
                <template #label>{{ $t("Body Length") }}</template>
            </VSelect>
        </div>

        <div class="col-3">
            <VSelect
                v-model="filters.status"
                :items="statusItems"
                item-key="key"
                item-text="text"
                :placeholder="$t('Filter by Status')"
                clearable
            >
                <template #label>{{ $t("Status") }}</template>
            </VSelect>
        </div>
</VForm>
</template>

<script setup>
// Components
import VForm from "@/components/form/VForm.vue";
import VInput from "@/components/form/VInput.vue";
import VSelect from "@/components/form/VSelect.vue";

// Composables
import {useModelRef} from "@/composables/model.composable";

// Services
import {t} from "@/services/language.service";

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(["update:modelValue"]);

const filters = useModelRef("modelValue");

const statusItems = [
    {
        key: "pending",
        text: t("Pending"),
    },
    {
        key: "confirmed",
        text: t("Confirmed"),
    },
    {
        key: "rejected",
        text: t("Rejected"),
    },
];

const textLength = [
    {
        key: 150,
        text: t("150 - 180 characters"),
    },
    {
        key: 180,
        text: t("180 - 210 characters"),
    },
    {
        key: 210,
        text: t("210 characters or more"),
    },
];



</script>
