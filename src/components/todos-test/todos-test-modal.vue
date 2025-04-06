<template>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h5>{{ $t("Todo Details") }}</h5>
                <button @click="closeModal" class="close-btn">&times;</button>
            </div>

            <div class="modal-body">
                <div class="todo-info">
                    <p>
                        <strong>{{ $t("Title") }}:</strong> {{ currentTodo?.title }}
                    </p>
                    <p>
                        <strong>{{ $t("Status") }}:</strong> {{ currentTodo?.status }}
                    </p>
                    <p v-if="currentTodo?.dueDate"><strong>Due:</strong> {{ formatDate(currentTodo.dueDate) }}</p>
                </div>
            </div>

            <div class="modal-footer">
                <button @click="deleteTodo" class="btn-delete"><i class="bi bi-trash"></i> {{ $t("Delete Todo") }}</button>
                <button @click="closeModal" class="btn-cancel">{{ $t("Cancel") }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const emit = defineEmits(["onDelete"]);

const showModal = ref(false);
const currentTodo = ref(null);

const openModal = (todo) => {
    currentTodo.value = todo;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const deleteTodo = async () => {
    if (!currentTodo.value?.id) return;

    try {
        await axios.delete(`http://localhost:8000/todos/${currentTodo.value.id}`);
        emit("onDelete", currentTodo.value.id);
        closeModal();
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

defineExpose({ openModal });
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #22272b;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    color: #b6c2cf;
}

.modal-header {
    padding: 16px;
    border-bottom: 1px solid #444;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 16px;
}

.modal-footer {
    padding: 16px;
    border-top: 1px solid #444;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.btn-delete {
    background: #c9372c;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-cancel {
    background: #444;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.close-btn {
    background: none;
    border: none;
    color: #b6c2cf;
    font-size: 1.5rem;
    cursor: pointer;
}

.todo-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
