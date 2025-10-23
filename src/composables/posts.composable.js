import { ref } from "vue";
import { useLoading } from "./loading.composable";
import PostsServices from "@/services/posts.services";
import useLocaleStorageCache from "./cache.composable";

export default function useFetchPost() {
    const { endLoading, isLoading, startLoading } = useLoading();
    const { getCache, setCache } = useLocaleStorageCache();

    const post = ref(null);

    async function fetchPost(id) {
        const cachedPosts = getCache("cached-posts") || {};

        if (cachedPosts[`post-${id}`]) {
            post.value = cachedPosts[`post-${id}`];
            return;
        } else {
            startLoading();
            return PostsServices.getOneById(id)
                .then((response) => {
                    post.value = response.data;
                    setCache('cached-posts', { ...cachedPosts, [`post-${id}`]: response.data })
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
