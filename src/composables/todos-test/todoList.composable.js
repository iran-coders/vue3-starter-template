import { ref, nextTick, onMounted } from "vue";
import { useTodoStore } from "@/stores/todo.store";
import TodoTestService from "@/services/todoTest.service";
import { useLoading } from "../loading.composable";

export default function useTodosList() {
    const todoStore = useTodoStore();

    const listTitleRefs = ref({});
    const dragItem = ref(null);
    const dragOverList = ref(null);
    const { startLoading, endLoading } = useLoading();

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
            startLoading();

            TodoTestService.setURL("statusCards");
            await TodoTestService.put(cardId, { title: newTitle });

            const relatedTodos = todoStore.todos.filter((todo) => todo.statusCardId === cardId);

            relatedTodos.map(async (todo) => {
                TodoTestService.setURL("todos");
                await TodoTestService.put(todo.id, { ...todo, status: newTitle });
                todo.status = newTitle;
            });
        } catch (error) {
            console.error(error);
        } finally {
            todoStore.statusCards[index].isEditing = false;
            endLoading();
        }
    };

    const getDraggedItem = (item) => {
        dragItem.value = item;
        console.log(item);
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
            startLoading();

            TodoTestService.setURL("todos");
            await TodoTestService.put(todo.id, {
                ...todo,
                statusCardId: listId,
                status: todoStore.statusCards.find((card) => card.id === listId)?.title,
            });

            await todoStore.fetchTodos();
        } catch (error) {
            console.error(error);
        } finally {
            resetDragState();
            endLoading();
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
        todoStore,
    };
}
