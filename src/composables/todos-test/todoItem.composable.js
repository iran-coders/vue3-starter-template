import {ref} from "vue";
import { useTodoStore } from "@/stores/todo.store";

export default function useTodoItem(emit) {
    const todoStore = useTodoStore();
    const todoModal = ref(null);
    const dragItem = ref(null);

    const openTodoModal = (todo) => {
        todoModal.value.openModal(todo);
    };

    const getTodosByStatus = (statusCardId) => {
        return todoStore.todos.filter((todo) => todo.statusCardId === statusCardId);
    };

    const handleDragStart = (event, todo, listId) => {
        dragItem.value = { todo, fromListId: listId };
        event.target.classList.add("dragging");
        emit("drag-start", dragItem.value);
    };

    return {
        todoModal,
        dragItem,
        openTodoModal,
        getTodosByStatus,
        handleDragStart,
        todoStore
    };
}
