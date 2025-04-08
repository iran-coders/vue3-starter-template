import { ref, nextTick, onMounted } from "vue";
import axios from "axios";
import { useTodoStore } from "@/stores/todo.store";

export default function useTodosList() {
    const todoStore = useTodoStore();

    const listTitleRefs = ref({});
    const dragItem = ref(null);
    const dragOverList = ref(null);

    const autoResize = (event) => {
        const el = event.target;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    const startEditingList = async (index) => {
        todoStore.statusCards.map((card, i) => {
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
        if (!todoStore.statusCards[index].isEditing) return;

        const cardId = todoStore.statusCards[index].id;
        const newTitle = todoStore.statusCards[index].title;

        try {
            await axios.put(`http://localhost:8000/statusCards/${cardId}`, { title: newTitle });

            const relatedTodos = todoStore.todos.filter((todo) => todo.statusCardId === cardId);

            relatedTodos.map(async (todo) => {
                await axios.put(`http://localhost:8000/todos/${todo.id}`, { ...todo, status: newTitle });
                todo.status = newTitle;
            });
        } catch (error) {
            console.error(error);
        } finally {
            todoStore.statusCards[index].isEditing = false;
        }
    };

    const getDraggedItem = (item) => {
        dragItem.value = item;
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
        console.log({ todo, fromListId });

        if (fromListId === listId) {
            resetDragState();
            return;
        }

        try {
            await axios.put(`http://localhost:8000/todos/${todo.id}`, {
                ...todo,
                statusCardId: listId,
                status: todoStore.statusCards.find((card) => card.id === listId)?.title,
            });

            await todoStore.fetchTodos();
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
        todoStore.fetchTodos();
        todoStore.fetchStatusCards();
    });

    return {
        listTitleRefs,
        dragItem,
        dragOverList,
        autoResize,
        startEditingList,
        finishEditingList,
        getDraggedItem,
        handleDragOver,
        handleDrop,
        resetDragState,
        todoStore
    };
}
