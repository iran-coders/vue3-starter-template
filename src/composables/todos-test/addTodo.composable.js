import { ref, nextTick, onMounted } from "vue";
import { useTodoStore } from "@/stores/todo.store";

export default function useAddTodo() {
    const todoStore = useTodoStore();

    const newTodoTitles = ref([]);
    const newDueDate = ref([]);
    const addTodoTextRefs = ref([]);

    const startAddingTodo = (index) => {
        todoStore.statusCards[index].isAddingNewTodo = true;
        newTodoTitles.value[index] = "";
        newDueDate.value[index] = "";

        nextTick(() => {
            if (addTodoTextRefs.value[index]) {
                addTodoTextRefs.value[index].focus();
            }
        });
    };

    const addNewTodo = async (index) => {
        if (!newTodoTitles.value[index]?.trim()) return;

        const newTodo = {
            title: newTodoTitles.value[index],
            status: todoStore.statusCards[index].title,
            statusCardId: todoStore.statusCards[index].id,
            dueDate: newDueDate.value[index] ? new Date(newDueDate.value[index]).toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            await todoStore.addTodo(newTodo);
            cancelAddingTodo(index);
        } catch (error) {
            console.error(error);
        }
    };

    const cancelAddingTodo = (index) => {
        todoStore.statusCards[index].isAddingNewTodo = false;
    };

    const autoResize = (event) => {
        const el = event.target;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    onMounted(() => {
        todoStore.fetchStatusCards({ isAddingNewTodo: false });
        todoStore.fetchTodos();
    });

    return {
        newTodoTitles,
        newDueDate,
        addTodoTextRefs,
        startAddingTodo,
        addNewTodo,
        cancelAddingTodo,
        autoResize,
    };
}
