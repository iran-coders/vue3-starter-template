import { defineStore } from "pinia";
import { ref } from "vue";
import { useLoading } from "@/composables/loading.composable";
import commentsService from "@/services/comments.service";

export const useCommentsStore = defineStore("comments", () => {
    const comments = ref(null);
    const { isLoading, startLoading, endLoading } = useLoading();

    const fetchComments = async (filters) => {
        try {
            startLoading();
            const response = await commentsService.getAll();
            let allComments = await response.data;
            allComments.forEach((comment, index) => {
                if (index % 2 == 0) return (comment.status = "pending");
                else if (index % 3 == 0) return (comment.status = "confirmed");
                else return (comment.status = "rejected");
            });

            let filteredComments = allComments;

            if (filters.id) {
                filteredComments = filteredComments.filter((comment) => {
                    return comment.id === +filters.id || comment.body.includes(String(filters.id));
                });
            }

            if (filters.length) {
                filteredComments = filteredComments.filter((comment) => {
                    return comment.body.length >= +filters.length && comment.body.length < +filters.length + 30;
                });
            }

            if (filters.status) {
                filteredComments = filteredComments.filter((comment) => {
                    return comment.status === filters.status;
                });
            }

            comments.value = filteredComments;
        } catch (error) {
            console.log(error);
        } finally {
            endLoading();
        }
    };

    return {
        comments,
        fetchComments,
        isLoading,
    };
});
