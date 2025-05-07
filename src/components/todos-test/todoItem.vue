<template>
<div class="d-flex flex-column gap-2">
    <div
        v-for="todo in getTodosByStatus(list?.id)"
        :key="todo.id"
        class="todo-item d-flex justify-content-between align-items-center bg-dark-grey ps-2 rounded-2"
        draggable="true"
        @dragstart="handleDragStart($event, todo, list.id)"
    >
        <span class="fs-6 m-0 text-grey">{{ todo?.title }}</span>
        <button class="btn text-white border-0" @click="openTodoModal(todo)">
            <i class="bi bi-three-dots text-grey"></i>
        </button>
    </div>
  <TodoModal ref="todoModal" @on-delete="todoStore.fetchTodos()" />
</div>
</template>
<script setup>
import TodoModal from "@/components/todos-test/todoModal.vue";
import useTodoItem from "@/composables/todos-test/todoItem.composable";

const props = defineProps({
    list: Object,
});

const emit = defineEmits(["drag-start"]);

const {
    todoModal,
    openTodoModal,
    getTodosByStatus,
    handleDragStart,
    todoStore,
} = useTodoItem(emit);
</script>


<style lang="scss">
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


.text-grey {
  color: #b6c2cf;
}

.bg-dark-grey {
  background: #22272b;
}
</style>
