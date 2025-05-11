import { ref } from "vue";
import { useLoading } from "./loading.composable";
import PostsServices from "@/services/posts.services";
import StorageService from "@/services/storage.service";

export default function useFetchPost() {
    const { endLoading, isLoading, startLoading } = useLoading();

    const post = ref(null);

    async function fetchPost (id) {
        const cachedPosts = StorageService.get("cached-posts") || {};

        if (cachedPosts[`post-${id}`]) {
            post.value = cachedPosts[`post-${id}`];
            return
        }
        else{
            startLoading();
            return PostsServices.getOneById(id)
            .then((response) => {
                post.value = response.data;
                StorageService.set('cached-posts', { ...cachedPosts, [`post-${id}`]: response.data })
                return response;
            })
            .finally(() => {
                endLoading();
            });
        }
    }

    return {
        postIsLoading: isLoading,
        post,
        fetchPost,
    };
}
