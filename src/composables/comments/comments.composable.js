import { ref, nextTick, onMounted } from "vue";

import { useCommentsStore } from "@/stores/comments.store";

export default function useComments () {
    const commentsStore = useCommentsStore();

    // onMounted(() => {
        commentsStore.fetchComments();
    // });

    return {
        commentsStore
    };
}
