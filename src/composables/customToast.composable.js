import { ref, getCurrentInstance } from 'vue';

// Utils
import { getUniqueId } from '@/utils';

const items = ref([]);

export function installCustomToast() {
    const instance = getCurrentInstance();
    if (instance.type.name !== 'CustomToast') {
        throw new Error('installToast should only be called in the Custom toast component');
    }

    return items;
}

export function useCustomToast() {
    function showToast({ theme, duration = 5000, clearable = true , title, callback}) {
        const id = getUniqueId();

        const _timeOutId = setTimeout(function () {
            hideToast(id);
        }, duration);

        items.value.push({
            id,
            duration,
            theme,
            clearable,
            title,
            callback,
            _time_out_id: _timeOutId
        });

        return id;
    }

    function hideToast(id) {
        const index = items.value.findIndex(function (item) {
            return item.id === id;
        });

        clearTimeout(items.value[index]._time_out_id);

        items.value.splice(index, 1);
    }

    return {
        showToast,
        hideToast
    };
}
