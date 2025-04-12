import { ref, nextTick, onMounted } from "vue";
import { useTodoStore } from "@/stores/todo.store";
import { useLoading } from "@/composables/loading.composable";
import TodoTestService from "@/services/todoTest.service";

export default function useAddList() {
    const todoStore = useTodoStore();

    const isAddingNewList = ref(false);
    const newListTitle = ref("");
    const newListTitleRef = ref(null);
    const { startLoading, endLoading } = useLoading();

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

    const startAddingNewList = () => {
        isAddingNewList.value = true;
        newListTitle.value = "";

        nextTick(() => {
            if (newListTitleRef.value) {
                newListTitleRef.value.focus();
            }
        });
    };

    const addNewList = async () => {
        if (!newListTitle.value.trim()) return;

        const newList = {
            title: newListTitle.value,
        };
        try {
            startLoading();
            TodoTestService.setURL("statusCards");

            const response = await TodoTestService.post(newList);
            todoStore.statusCards.push({
                ...response.data,
                isAddingNewTodo: false,
            });
            cancelAddingList();
        } catch (error) {
            console.error(error);
            endLoading();
        }
    };

    const cancelAddingList = () => {
        isAddingNewList.value = false;
    };

    const autoResize = (event) => {
        const el = event.target;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    onMounted(() => {
        fetchStatusCards();
        todoStore.fetchTodos();
    });

    return {
        isAddingNewList,
        newListTitle,
        newListTitleRef,
        fetchStatusCards,
        startAddingNewList,
        addNewList,
        cancelAddingList,
        autoResize,
    };
}
