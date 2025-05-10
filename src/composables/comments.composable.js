import { computed, ref } from "vue";
import { useLoading } from "./loading.composable";
import { keyBy } from "@/utils";
import CommentsService from "@/services/comments.service";

export const useFetchComments = () => {
    const { isLoading, startLoading, endLoading } = useLoading();
    const comments = ref([]);
    const commentsKeyById = computed(() => keyBy(comments.value, "id"));

    /**
     * @param {AxiosRequestConfig} [config]
     */
    const fetchComments = (config) => {
        startLoading();
        return CommentsService.getAll(config)
            .then((response) => {
                comments.value = response.data.map(item=>({...item,status:"PENDING"}));
                return response;
            })
            .finally(() => {
                endLoading();
            });
    };

    return {
        comments,
        commentsIsLoading: isLoading,
        commentsKeyById,
        fetchComments,
    };
};
