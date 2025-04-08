<template>
<div v-if="!list.isAddingNewTodo">
    <button class="add-btn d-flex gap-1 btn border-0 w-100 text-start px-1 mt-2 rounded-3" @click="startAddingTodo(listIndex)">
        <i class="bi bi-plus-lg"></i>
        <span class="bg-transparent">Add a todo</span>
    </button>
</div>
<div v-if="list.isAddingNewTodo" class="d-flex flex-column gap-4">
    <div>
            <textarea
                ref="addTodoTextRefs"
                v-model="newTodoTitles[listIndex]"
                class="new-todo-title mt-1 w-100 fs-6 m-0 text-grey bg-transparent btn-outline-info rounded-1"
                placeholder="Enter a title or paste a link"
                @input="autoResize"
                @keyup.enter="addNewTodo(listIndex)"
                autofocus
            />
        <div class="due-date d-flex flex-column gap-1">
            <div class="d-flex gap-2">
                <i class="bi bi-alarm"></i>
                <span>Due Date: </span>
            </div>
            <input v-model="newDueDate[listIndex]" class="bg-transparent text-white border-0 p-1" type="datetime-local"/>
        </div>
    </div>
    <div class="d-flex gap-2 align-items-center">
        <button class="btn bg-info rounded-2" @click="addNewTodo(listIndex)">Add todo</button>
        <button class="btn text-white" @click="cancelAddingTodo(listIndex)">
            <i class="bi bi-x-lg"></i>
        </button>
    </div>
</div>
</template>

<script setup>

import useAddTodo from "@/composables/todos-test/addTodo.composable";

const props = defineProps({
    list: Object,
    listIndex: [Number, String],
});

const {
    newTodoTitles,
    newDueDate,
    addTodoTextRefs,
    startAddingTodo,
    addNewTodo,
    cancelAddingTodo,
    autoResize,
} = useAddTodo();
</script>


<style lang="scss">
.new-todo-title {
    resize: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.due-date {
    font-size: 0.875rem;
}

.text-grey {
    color: #b6c2cf;
}

.add-btn {
    font-size: 14px;
    color: #9fadbc;

    &:hover {
        background-color: #a6c5e229;
    }
}
</style>
