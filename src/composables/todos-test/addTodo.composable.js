import { ref, nextTick, onMounted } from "vue";
import axios from "axios";
import { useTodoStore } from "@/stores/todo.store";

export default function useAddTodo() {
    const todoStore = useTodoStore();

    const todos = ref([]);
    const newTodoTitles = ref([]);
    const newDueDate = ref([]);
    const addTodoTextRefs = ref([]);

    const fetchStatusCards = async () => {
        try {
            await todoStore.fetchStatusCards();
            todoStore.statusCards.map((card) => ({
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
        fetchStatusCards();
        fetchTodos();
    });

    return {
        todos,
        newTodoTitles,
        newDueDate,
        addTodoTextRefs,
        fetchStatusCards,
        fetchTodos,
        startAddingTodo,
        addNewTodo,
        cancelAddingTodo,
        autoResize,
    };
}
