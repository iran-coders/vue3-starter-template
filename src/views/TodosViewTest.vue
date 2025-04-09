<template>
    <div class="h3 mb-4">{{ $t("Todos Test") }}</div>

    <div class="d-flex flex-wrap gap-2 row-gap-4">
        <div
            v-for="(list, index) in statusCards"
            :key="list?.id"
            class="list-card d-flex flex-column gap-2 text-light p-2 rounded-3 overflow-hidden w-100"
            @dragover="handleDragOver($event, list.id)"
            @drop="handleDrop($event, list.id)"
        >
            <div class="d-flex justify-content-between align-items-center">
                <textarea
                    v-model="list.title"
                    ref="(el) => listTitleRefs[index] = el"
                    class="card-title fs-6 m-0 grey bg-transparent border-0 w-100"
                    :readonly="!list.isEditing"
                    @click="startEditingList(index)"
                    @blur="finishEditingList(index)"
                    @keyup.enter="finishEditingList(index)"
                    @input="autoResize"
                    :class="{
                        'cursor-text': list.isEditing,
                        'cursor-pointer': !list.isEditing,
                    }"
                />
            </div>
            <div class="d-flex flex-column gap-2">
                <div
                    v-for="todo in getTodosByStatus(list?.id)"
                    :key="todo.id"
                    class="todo-item d-flex justify-content-between align-items-center dark-grey ps-2 rounded-2"
                    draggable="true"
                    @dragstart="handleDragStart($event, todo, list.id)"
                >
                    <span class="fs-6 m-0 grey">{{ todo?.title }}</span>
                    <button class="btn text-white border-0" @click="openTodoModal(todo)">
                        <i class="bi bi-three-dots grey"></i>
                    </button>
                </div>
            </div>
            <div v-if="!list.isAddingNewTodo">
                <button class="add-btn d-flex gap-1 btn border-0 w-100 text-start px-1 mt-2 rounded-3" @click="startAddingTodo(index)">
                    <i class="bi bi-plus-lg"></i>
                    <span class="bg-transparent">Add a todo</span>
                </button>
            </div>
            <div v-if="list.isAddingNewTodo" class="d-flex flex-column gap-4">
                <div>
                    <textarea
                        ref="addTodoTextRefs"
                        v-model="newTodoTitles[index]"
                        class="new-todo-title mt-1 w-100 fs-6 m-0 grey bg-transparent btn-outline-info rounded-1"
                        placeholder="Enter a title or paste a link"
                        @input="autoResize"
                        @keyup.enter="addNewTodo(index)"
                        autofocus
                    />
                    <div class="due-date d-flex flex-column gap-1">
                        <div class="d-flex gap-2">
                            <i class="bi bi-alarm"></i>
                            <span>Due Date: </span>
                        </div>
                        <input v-model="newDueDate[index]" class="bg-transparent text-white border-0 p-1" type="datetime-local" />
                    </div>
                </div>
                <div class="d-flex gap-2 align-items-center">
                    <button class="btn bg-info rounded-2" @click="addNewTodo(index)">Add todo</button>
                    <button class="btn text-white" @click="cancelAddingTodo(index)">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        </div>

        <!--------------------------------->
        <button
            v-if="!isAddingNewList"
            class="list-card add-list d-flex gap-2 border-0 overflow-hidden w-100 p-2 rounded-3 text-light"
            @click="startAddingNewList"
        >
            <i class="bi bi-plus-lg"></i>
            <span> Add List </span>
        </button>

        <div v-if="isAddingNewList" class="d-flex flex-column gap-1 list-card overflow-hidden w-100 p-2 rounded-3">
            <div>
                <textarea
                    ref="newListTitleRef"
                    v-model="newListTitle"
                    class="new-todo-title mt-1 w-100 fs-6 m-0 grey bg-transparent btn-outline-info rounded-1"
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
    </div>
    <TodosTestModal ref="todoModal" @on-delete="fetchTodos" />
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import axios from "axios";
import TodosTestModal from "@/components/todos-test/todos-test-modal.vue";

const statusCards = ref([]);

const todos = ref([]);
const newTodoTitles = ref([]);
const newDueDate = ref([]);
const addTodoTextRefs = ref([]);

const isAddingNewList = ref(false);
const newListTitle = ref("");
const newListTitleRef = ref(null);

const listTitleRefs = ref({});

const todoModal = ref(null);

const dragItem = ref(null);
const dragOverList = ref(null);

const openTodoModal = (todo) => {
    todoModal.value.openModal(todo);
};

const getTodosByStatus = (statusCardId) => {
    return todos.value.filter((todo) => todo.statusCardId === statusCardId);
};

const fetchStatusCards = async () => {
    try {
        const response = await axios.get("http://localhost:8000/statusCards");
        statusCards.value = response.data.map((card) => ({
            ...card,
            isAddingNewTodo: false,
        }));
    } catch (error) {
        console.error(error);
    }
};

const fetchTodos = async () => {
    try {
        const response = await axios.get("http://localhost:8000/todos");
        todos.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

const startAddingTodo = (index) => {
    statusCards.value[index].isAddingNewTodo = true;
    newTodoTitles.value[index] = "";
    newDueDate.value[index] = "";

    nextTick(() => {
        if (addTodoTextRefs.value[index]) {
            addTodoTextRefs.value[index].focus();
        }
    });
};

const startAddingNewList = () => {
    isAddingNewList.value = true;
    newListTitle.value = "";

    nextTick(() => {
        if (newListTitleRef.value) {
            newListTitleRef.value.focus();
        }
    });
};

const addNewTodo = async (index) => {
    if (!newTodoTitles.value[index]?.trim()) return;

    const newTodo = {
        title: newTodoTitles.value[index],
        status: statusCards.value[index].title,
        statusCardId: statusCards.value[index].id,
        dueDate: newDueDate.value[index] ? new Date(newDueDate.value[index]).toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    try {
        const response = await axios.post("http://localhost:8000/todos", newTodo);
        todos.value.push(response.data);
        cancelAddingTodo(index);
    } catch (error) {
        console.error(error);
    }
};

const addNewList = async () => {
    if (!newListTitle.value.trim()) return;

    const newList = {
        title: newListTitle.value,
    };

    try {
        const response = await axios.post("http://localhost:8000/statusCards", newList);
        statusCards.value.push({
            ...response.data,
            isAddingNewTodo: false,
        });
        cancelAddingList();
    } catch (error) {
        console.error(error);
    }
};

const cancelAddingTodo = (index) => {
    statusCards.value[index].isAddingNewTodo = false;
};

const cancelAddingList = () => {
    isAddingNewList.value = false;
};

const autoResize = (event) => {
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
};

const startEditingList = async (index) => {
    statusCards.value.map((card, i) => {
        card.isEditing = i === index;
    });

    nextTick(() => {
        if (listTitleRefs.value[index]) {
            listTitleRefs.value[index].focus();
            listTitleRefs.value[index].select();
        }
    });
};

const finishEditingList = async (index) => {
    if (!statusCards.value[index].isEditing) return;

    const cardId = statusCards.value[index].id;
    const newTitle = statusCards.value[index].title;

    try {
        await axios.put(`http://localhost:8000/statusCards/${cardId}`, { title: newTitle });

        const relatedTodos = todos.value.filter((todo) => todo.statusCardId === cardId);

        relatedTodos.map(async (todo) => {
            await axios.put(`http://localhost:8000/todos/${todo.id}`, { ...todo, status: newTitle });
            todo.status = newTitle;
        });
    } catch (error) {
        console.error(error);
    } finally {
        statusCards.value[index].isEditing = false;
    }
};

const handleDragStart = (event, todo, listId) => {
    dragItem.value = { todo, fromListId: listId };
    event.target.classList.add("dragging");
};
const handleDragOver = (event, listId) => {
    event.preventDefault();
    event.stopPropagation();
    dragOverList.value = listId;
};

const handleDrop = async (event, listId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!dragItem.value) return;

    const { todo, fromListId } = dragItem.value;

    if (fromListId === listId) {
        resetDragState();
        return;
    }

    try {
        await axios.put(`http://localhost:8000/todos/${todo.id}`, {
            ...todo,
            statusCardId: listId,
            status: statusCards.value.find((c) => c.id === listId)?.title,
        });

        await fetchTodos();
    } catch (error) {
        console.error(error);
    } finally {
        resetDragState();
    }
};

const resetDragState = () => {
    document.querySelectorAll(".dragging").forEach((el) => {
        el.classList.remove("dragging");
    });

    dragItem.value = null;
    dragOverList.value = null;
};

onMounted(() => {
    fetchStatusCards();
    fetchTodos();
});
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

    .card-title {
        resize: none;
        height: 30px;
        cursor: pointer;

        &.cursor-pointer {
            cursor: pointer;
        }

        &.cursor-text {
            cursor: text;
        }

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .todo-item {
        &:active {
            cursor: grabbing;
        }

        &.dragging {
            opacity: 0.5;
            rotate: 2deg;
        }
    }

    .todo-item.dragging {
        opacity: 0.5;
        transform: scale(0.98);
    }

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

.grey {
    color: #b6c2cf;
}

.dark-grey {
    background: #22272b;
}

.add-btn {
    font-size: 14px;
    color: #9fadbc;

    &:hover {
        background-color: #a6c5e229;
    }
}
</style>
