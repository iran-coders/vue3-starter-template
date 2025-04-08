<template>
    <button
        v-if="!isAddingNewList"
        class="list-card add-list d-flex gap-2 border-0 overflow-hidden w-100 p-2 rounded-3 text-light"
        @click="startAddingNewList"
    >
        <i class="bi bi-plus-lg"></i>
        <span> {{ $t("Add List") }} </span>
    </button>

    <div v-if="isAddingNewList" class="d-flex flex-column gap-1 list-card overflow-hidden w-100 p-2 rounded-3">
        <div>
            <textarea
                ref="newListTitleRef"
                v-model="newListTitle"
                class="new-todo-title ps-1 pe-1 w-100 fs-6 m-0 text-grey bg-dark-grey btn-outline-info rounded-1 border border-dark-subtle"
                placeholder="Enter a title"
                @input="autoResize"
                @keyup.enter="addNewList"
                autofocus
            />
        </div>
        <div class="d-flex gap-2 align-items-center">
            <button class="btn bg-info rounded-2" @click="addNewList">{{ $t("Add List") }}</button>
            <button class="btn text-white" @click="cancelAddingList">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import useAddList from "@/composables/todos-test/addList.composable";

const { isAddingNewList, newListTitle, newListTitleRef, startAddingNewList, addNewList, cancelAddingList, autoResize } = useAddList();
</script>

<style lang="scss">
.add-list {
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #444;
    }
}

.list-card {
    max-width: 16.875rem;
    background: #101204;
    height: fit-content;

    .new-todo-title {
        resize: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }
}

.due-date {
    font-size: 0.875rem;
}

.list-card-title {
    color: #b6c2cf;
}

.text-grey {
    color: #b6c2cf;
}
</style>
