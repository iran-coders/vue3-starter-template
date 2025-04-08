import {defineStore} from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTodoStore = defineStore('todos', () => {
    const statusCards = ref([]);
    const todos = ref([]);
    const isLoading = ref(false);

    const fetchStatusCards = async () => {
        isLoading.value = true;

        try {
            const response = await axios.get("http://localhost:8000/statusCards");
            statusCards.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTodos = async () => {
        isLoading.value = true;

        try {
            const response = await axios.get("http://localhost:8000/todos");
            todos.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    };

    const addTodo = async (body) => {
        isLoading.value = true;

        try {
            const response = await axios.post("http://localhost:8000/todos", body);
            todos.value.push(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    };


    return {
        statusCards,
        todos,
        isLoading,
        fetchStatusCards,
        fetchTodos,
        addTodo,
    };
});
