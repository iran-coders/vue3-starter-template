import { defineStore } from "pinia";
import { ref } from "vue";import { useLoading } from "@/composables/loading.composable";
import commentsService from "@/services/comments.service";

export const useCommentsStore = defineStore("comments", () => {
    const comments = ref(null);
    const { isLoading, startLoading, endLoading } = useLoading();

    const fetchComments = async (filters) => {
        try {
            startLoading();
            const response = await commentsService.getAll();
            let allComments = await response.data;
            allComments.forEach((comment) => comment.status = 'pending')

            let filteredComments = allComments;

            if (filters.id) {
                console.log(filters.id)
                filteredComments = filteredComments.filter(comment => {
                    console.log(filteredComments)
                    return comment.id === +filters.id || comment.body.includes(String(filters.id));
                });
            }

            if (filters.length) {
                console.log(filters.length)
                // const requiredLength = +filters.length;
                filteredComments = filteredComments.filter(comment => {
                    return comment.body.length > +filters.length;
                })

                // comments.value = allComments.filter(comment => {
                //     return comment.id === +filters.id || comment.body.includes(String(filters.id));
                // });
            }
            console.log('filteredComments', filteredComments)

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
        isLoading
    };
});
