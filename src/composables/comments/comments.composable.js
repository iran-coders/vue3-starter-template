import {ref, nextTick, onMounted, computed} from "vue";

import {useCommentsStore} from "@/stores/comments.store";
import {useToast} from "../toast.composable";
import {t} from "@/services/language.service";
import {usePopup} from "@/composables/popup.composable";

export default function useComments() {
    const {showToast} = useToast();
    const {showPopup} = usePopup();
    const commentsStore = useCommentsStore();
    const selectedItem = ref(null);
    const selectedResponse = ref(null);
    const responseItems = [
        {
            key: "confirmed",
            text: t("Confirmed"),
        },
        {
            key: "rejected",
            text: t("Rejected"),
        },
    ];
    const relatedPost = computed(() => {
        return commentsStore.posts.find(post => post.id === selectedItem.value.postId);
    });
    const showInfoModal = ref(false);
    const confirm = (item) => {
        const foundItem = commentsStore.comments.find((comment) => comment.id === item.id);
        foundItem.status = "confirmed";
    };

    const confirmAll = () => {

        showPopup({
            id: Date.now(),
            title: "title",
            body: `Are you sure want to confirm all comments?`,
            theme: "warning",
            confirm: () => {
                commentsStore.comments.forEach((comment) => comment.status = "confirmed");
            }
        });
    };

    const reject = (item) => {
        const tempItemHolder = {...item};
        let foundItem = commentsStore.comments.find((comment) => comment.id === item.id);

        showPopup({
            id: Date.now(),
            title: "title",
            body: `Are you sure want to delete comment with id ${item.id} ...`,
            theme: "warning",
            timer: true,
            confirm: () => {
                foundItem = commentsStore.comments.find((comment) => comment.id === item.id);
                foundItem.status = tempItemHolder.status;
                foundItem.status = "rejected";

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
            }
        });

    };

    const rejectAll = () => {
        const tempItemHolder = JSON.parse(JSON.stringify(commentsStore.comments));

        showPopup({
            id: Date.now(),
            title: "title",
            body: `Are you sure want to delete all comments?`,
            theme: "warning",
            timer: true,
            confirm: () => {
                commentsStore.comments.forEach((comment) => comment.status = "rejected");

                showToast({
                    id: Date.now(),
                    title: "title",
                    body: `Rejecting all comments ...`,
                    theme: "success",
                    clearable: true,
                    duration: 10000,
                    timer: true,
                    undoAction: () => {
                        commentsStore.comments.forEach((comment, index) => comment.status = tempItemHolder[index].status)
                    },
                });
            }
        });

    };

    const handleResponseAllChange = () => {
        if (selectedResponse.value === 'confirmed') confirmAll()
        else if (selectedResponse.value === 'rejected') rejectAll()
        else  showToast({
                id: Date.now(),
                title: "title",
                body: `Choosing Response is required!`,
                theme: "danger",
                clearable: true,
                duration: 5000,
                timer: false
            });
    }

    const showInfo = (item) => {
        selectedItem.value = item;
        showInfoModal.value = true;
    };


    const commentModalTitleText = ((item) => {
        return t("Information") + ' ' + t("for") + ' ' + t("comment") + ' ' + t("with") + ' ' + t("ID") + ": " + item?.id
    })

    commentsStore.fetchComments();

    return {
        commentsStore,
        confirm,
        reject,
        showInfo,
        showInfoModal,
        relatedPost,
        commentModalTitleText,
        selectedItem,
        selectedResponse,
        responseItems,
        handleResponseAllChange,
    };
}
