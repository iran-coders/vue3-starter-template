import { ref, getCurrentInstance } from "vue";

// Utils
import { getUniqueId } from "@/utils";

const items = ref([]);

export function installToast() {
    const instance = getCurrentInstance();

    if (instance.type.name !== "VToasts") {
        throw new Error("installToast should only be called in the Toasts component");
    }

    return items;
}

export function useToast() {
    function showToast({ body, theme, timer = true, duration = 5000, clearable = true, title, undoAction }) {
        const id = getUniqueId();

        const timerRef = ref(duration);

        let intervalId = null;

        if (timer) {
            intervalId = setInterval(() => {
                if (timerRef.value > 0) {
                    timerRef.value -= 1000;
                }

                if (timerRef.value <= 0) {
                    clearInterval(intervalId);
                    hideToast(id);
                }
            }, 1000);
        }

        items.value.push({
            id,
            body,
            duration,
            theme,
            clearable,
            title,
            undoAction,
            timer: timer ? timerRef : false,
            _interval_id: intervalId,
        });

        if (!timer && duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }

        return id;
    }

    function hideToast(id) {
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

    const undo = (item) => {
        if (item.undoAction) {
            item.undoAction();
            hideToast(item.id);
        }
    };

    return {
        showToast,
        hideToast,
        undo,
    };
}
