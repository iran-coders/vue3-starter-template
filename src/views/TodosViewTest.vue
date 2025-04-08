<template>
<div class="h3 mb-4">{{ $t("Todos Test") }}</div>

<div class="d-flex flex-wrap gap-2 row-gap-4">
    <TodoList/>
    <AddList/>
</div>
</template>

<script setup>
import TodoList from "@/components/todos-test/todoList.vue";
import AddList from "@/components/todos-test/addList.vue";
</script>
