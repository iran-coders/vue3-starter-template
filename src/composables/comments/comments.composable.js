import { ref, nextTick, onMounted } from "vue";

import { useCommentsStore } from "@/stores/comments.store";
import { useToast } from "../toast.composable";

export default function useComments() {
    const { showToast } = useToast();
    const commentsStore = useCommentsStore();

    const showInfoModal = ref(false);
    const confirm = (item) => {
        const foundItem = commentsStore.comments.find((comment) => comment.id === item.id);
        foundItem.status = "confirmed";
    };

    const reject = (item) => {
        const tempItemHolder = { ...item };
        let foundItem = commentsStore.comments.find((comment) => comment.id === item.id);
        foundItem.status = "rejected";

        showInfoModal.value = true;
        showToast({
            id: Date.now(),
            title: "title",
            body: `Rejecting comment with id ${item.id} ...`,
            theme: "success",
            clearable: true,
            duration: 10000,
            timer: true,
            undoAction: () => {
                foundItem = commentsStore.comments.find((comment) => comment.id === item.id);
                foundItem.status = tempItemHolder.status;
            },
        });
    };

    const showInfo = (item) => {
        showInfoModal.value = true;
    };

    commentsStore.fetchComments();

    return {
        commentsStore,
        confirm,
        reject,
        showInfo,
        showInfoModal,
    };
}
