<template>
  <div
      v-for="(list, index) in todoStore.statusCards"
      :key="list?.id"
      class="list-card d-flex flex-column gap-2 text-light p-2 rounded-3 overflow-hidden w-100"
      @dragover="handleDragOver($event, list.id)"
      @drop="handleDrop($event, list.id)"
  >
    <div class="d-flex justify-content-between align-items-center">
     <textarea
         v-model="list.title"
         ref="(el) => listTitleRefs[index] = el"
         class="card-title fs-6 m-0 text-grey bg-transparent border-0 w-100"
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

    <TodoItem
        :list="list"
        @drag-start="getDraggedItem"
    />

    <AddTodo
      :list="list"
      :listIndex="index"
    />
  </div>
</template>

<script setup>
import TodoItem from "@/components/todos-test/todoItem.vue";
import AddTodo from "@/components/todos-test/addTodo.vue";
import useTodoList from "@/composables/todos-test/todoList.composable";

const {
    autoResize,
    startEditingList,
    finishEditingList,
    getDraggedItem,
    handleDragOver,
    handleDrop,
    todoStore
} = useTodoList();
</script>


<style lang="scss">

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
}

.text-grey {
  color: #b6c2cf;
}
</style>
