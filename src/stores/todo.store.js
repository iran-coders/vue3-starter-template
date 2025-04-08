import { defineStore } from "pinia";
import { ref } from "vue";
import { useLoading } from "@/composables/loading.composable";
import TodoTestService from "@/services/todoTest.service";

export const useTodoStore = defineStore("todos", () => {
    const statusCards = ref([]);
    const todos = ref([]);
    const { isLoading, startLoading, endLoading } = useLoading();

    const fetchStatusCards = async (addingStatus) => {
        startLoading();

        try {
            TodoTestService.setURL("statusCards");
            const response = await TodoTestService.getAll();
            statusCards.value = response.data;

            if (addingStatus) {
                statusCards.value.map((card) => ({
                    ...card,
                    ...addingStatus,
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            endLoading();
        }
    };

    const fetchTodos = async () => {
        startLoading();

        try {
            TodoTestService.setURL("todos");
            const response = await TodoTestService.getAll();
            todos.value = response.data;
        } catch (error) {
            console.error(error);
        } finally {
            endLoading();
        }
    };

    const addTodo = async (body) => {
        startLoading();

        try {
            TodoTestService.setURL("todos");
            const response = await TodoTestService.post(body);
            todos.value.push(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            endLoading();
        }
    };

    return {
        statusCards,
        todos,
        fetchStatusCards,
        fetchTodos,
        addTodo,
        isLoading,
    };
});
