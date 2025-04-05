<template>
    <div class="h3 mb-4">{{ $t("Todos Test") }}</div>

    <div class="d-flex gap-2">
        <div
            v-for="(list, index) in lists"
            :key="list.title"
            class="list-card d-flex flex-column gap-2 text-light p-2 rounded-3 overflow-hidden w-100"
        >
            <div class="d-flex justify-content-between align-items-center ps-2">
                <h3 class="card-title fs-6 m-0 grey bg-transparent border-0">
                    {{ list.title }}
                </h3>
            </div>
            <div class="d-flex flex-column gap-2">
                <div
                    v-for="todo in filteredTodos[list.title]"
                    :key="todo.id"
                    class="d-flex justify-content-between align-items-center dark-grey ps-2 rounded-2"
                >
                    <span class="fs-6 m-0 grey">{{ todo.title }}</span>
                    <button class="btn text-white border-0">
                        <i class="bi bi-three-dots grey"></i>
                    </button>
                </div>
            </div>
            <div v-if="!list.isAddingNewTodo">
                <button class="add-btn d-flex gap-1 btn border-0 w-100 text-start px-1 mt-2 rounded-3" @click="onAddClick(index)">
                    <i class="bi bi-plus-lg"></i>
                    <span class="bg-transparent">Add a todo</span>
                </button>
            </div>
            <div v-if="list.isAddingNewTodo">
                <textarea
                    class="new-todo-title mt-1 w-100 fs-6 m-0 grey bg-transparent btn-outline-info"
                    placeholder="Enter a title or paste a link"
                    :ref="(el) => (addTodoTextRefs[index] = el)"
                    @blur="onAddBlur"
                    @input="autoResize"
                />
                <div class="d-flex gap-2 align-items-center">
                    <button class="btn bg-info rounded-2">Add todo</button>
                    <button class="btn text-white">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, reactive, computed, onMounted } from "vue";
import axios from "axios";

const lists = ref([
    { title: "active", isAddingNewTodo: false },
    { title: "inProgress", isAddingNewTodo: false },
    { title: "done", isAddingNewTodo: false },
]);

const todos = ref([]);
// const isFocused = ref(false);
const addTodoTextRefs = reactive({});

const filteredTodos = computed(() => {
    const groupedTodos = {};
    lists.value.forEach((list) => {
        groupedTodos[list.title] = todos.value.filter((todo) => todo.status === list.title);
    });
    return groupedTodos;
});

const fetchTodos = async () => {
    try {
        const response = await axios.get("http://localhost:8000/todos");
        todos.value = response.data;
    } catch (error) {
        console.error("خطا در دریافت داده‌ها:", error);
    }
};

onMounted(() => {
    fetchTodos();
});

const autoResize = (event) => {
    const el = event.target;
    el.style.height = `${el.scrollHeight}px`;
};

// const onFocus = (event) => {
//     isFocused.value = true;
//     const textarea = event.target;
//     textarea.select();
// };

// const onBlur = () => {
//     isFocused.value = false;
// };

const onAddClick = (index) => {
    lists.value[index].isAddingNewTodo = true;

    nextTick(() => {
        if (addTodoTextRefs[index]) {
            addTodoTextRefs[index].focus();
        }
    });
};

const onAddBlur = () => {
    lists.value.forEach((list) => {
        list.isAddingNewTodo = false;
    });
};
</script>

<style lang="scss">
.list-card {
    max-width: 16.875rem;
    background: #101204;

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

    .new-todo-title {
        resize: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }
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

<!-- <template>
    <div class="h3 mb-4">{{ $t("Todos Test") }}</div>

    <div class="d-flex gap-2">
        <div
            v-for="(list, index) in lists"
            :key="list"
            class="list-card d-flex flex-column gap-2 text-light p-2 rounded-3 overflow-hidden w-100"
        >
            <div class="d-flex justify-content-between align-items-center ps-2">
                <textarea
                    v-model="lists[index].title"
                    class="card-title fs-6 m-0 grey bg-transparent border-0"
                    @input="autoResize"
                    @focus="onFocus"
                    @blur="onBlur"
                    :class="{ 'cursor-text': isFocused, 'cursor-pointer': !isFocused }"
                />

                <button class="btn text-white border-0">
                    <i class="bi bi-three-dots grey"></i>
                </button>
            </div>
            <div class="d-flex flex-column gap-2">
                <div
                    v-for="todo in todos"
                    :key="todo?.id"
                    class="d-flex justify-content-between align-items-center dark-grey ps-2 rounded-2"
                >
                    <span class="fs-6 m-0 grey">{{ todo?.title }}</span>
                    <button class="btn text-white border-0">
                        <i class="bi bi-three-dots grey"></i>
                    </button>
                </div>
            </div>
            <div v-if="!lists[index].isAddingNewTodo">
                <button class="add-btn d-flex gap-1 btn border-0 w-100 text-start px-1 mt-2 rounded-3" @click="onAddClick(index)">
                    <i class="bi bi-plus-lg"></i>
                    <span class="bg-transparent">Add a todo</span>
                </button>
            </div>
            <div v-if="lists[index].isAddingNewTodo">
                <textarea
                    class="new-todo-title mt-1 w-100 fs-6 m-0 grey bg-transparent btn-outline-info"
                    placeholder="Enter a title or
                paste a link"
                    :ref="(el) => (addTodoTextRefs[index] = el)"
                    @blur="onAddBlur"
                    @input="autoResize"
                />
                <div class="d-flex gap-2 align-items-center">
                    <button class="btn bg-info rounded-2">Add todo</button>
                    <button class="btn text-white">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, reactive, onMounted } from "vue";
import axios from "axios";

const lists = ref([
    { title: "active", isAddingNewTodo: false },
    { title: "inProgress", isAddingNewTodo: false },
    { title: "done", isAddingNewTodo: false },
]);
const todos = ref([]);
const isFocused = ref(false);
const addTodoTextRefs = reactive({});

const fetchTodos = async () => {
    try {
        const response = await axios.get("http://localhost:8000/todos");
        todos.value = response.data;
    } catch (error) {
        console.error("خطا در دریافت داده‌ها:", error);
    }
};

onMounted(() => {
    fetchTodos();
});

const autoResize = (event) => {
    const el = event.target;
    el.style.height = `${el.scrollHeight}px`;
};

const onFocus = (event) => {
    isFocused.value = true;
    const textarea = event.target;
    textarea.select();
};

const onBlur = () => {
    isFocused.value = false;
};

const onAddClick = (index) => {
    lists.value[index].isAddingNewTodo = true;

    nextTick(() => {
        if (addTodoTextRefs[index]) {
            addTodoTextRefs[index].focus();
        }
    });
};

const onAddBlur = () => {
    lists.value.forEach((list) => {
        list.isAddingNewTodo = false;
    });
};
</script>

<style lang="scss">
.list-card {
    max-width: 16.875rem;
    background: #101204;

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

    .new-todo-title {
        resize: none;
        // height: 30px;

        &::-webkit-scrollbar {
            display: none;
        }
    }
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
</style> -->
