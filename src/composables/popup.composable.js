import {ref, getCurrentInstance} from "vue";

// Utils
import {getUniqueId} from "@/utils";

const items = ref([]);

export function installPopup() {
    const instance = getCurrentInstance();

    if (instance.type.name !== "VPopup") {
        throw new Error("installPopup should only be called in the popup component");
    }

    return items;
}

export function usePopup() {
    function showPopup({body, theme, title, confirm, cancel}) {
        const id = getUniqueId();

        items.value.push({
            id,
            body,
            theme,
            title,
            confirm,
            cancel
        });

        return id;
    }

    function hidePopup(id) {
        const index = items.value.findIndex(function (item) {
            return item.id === id;
        });

        if (index !== -1) {
            if (items.value[index]._interval_id) {
                clearInterval(items.value[index]._interval_id);
            }

            items.value.splice(index, 1);
        }
    }

    const confirm = (item) => {
        if (item.confirm) item.confirm();
        hidePopup(item.id);
    };

    const cancel = (item) => {
        if (item.cancel) item.cancel();
        hidePopup(item.id);
    };

    return {
        showPopup,
        hidePopup,
        confirm,
        cancel
    };
}
