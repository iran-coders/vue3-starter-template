import { ref } from "vue";
import { useLoading } from "./loading.composable";
import PostsServices from "@/services/posts.services";

export default function useFetchPost() {
    const { endLoading, isLoading, startLoading } = useLoading();

    const post = ref(null);

    function fetchPost(id) {
        startLoading()
        return PostsServices.getOneById(id).then((response) => {
            post.value = response.data
            return response
        }).finally(()=>{
            endLoading()
        });
    }

    return {
        postIsLoading: isLoading,
        post,
        fetchPost
    };
}
