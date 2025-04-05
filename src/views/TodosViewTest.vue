<template>
    <div class="h3 mb-4">{{ $t('Todos Test') }}</div>

    <div class="d-flex gap-2">
        <div v-for="list in lists" :key="list" class="list-card d-flex flex-column gap-2 text-light p-2 rounded-3 overflow-hidden w-100">
            <div class="d-flex justify-content-between align-items-center ps-2">
                <textarea class="fs-6 m-0 grey bg-transparent border-0"
                    @input="autoResize"
                          @focus="onFocus"
                      @blur="onBlur"
                          :class="{ 'cursor-text': isFocused, 'cursor-pointer': !isFocused }"
                          ref="title"
                >active</textarea>
                <button class="btn text-white border-0">
                    <i class="bi bi-three-dots grey"></i>
                </button>
            </div>
            <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-content-between align-items-center dark-grey ps-2 rounded-2">
                    <span class="fs-6 m-0 grey">active</span>
                    <button class="btn text-white border-0">
                        <i class="bi bi-three-dots grey"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-between align-items-center dark-grey ps-2 rounded-2">
                    <span class="fs-6 m-0 grey">active</span>
                    <button class="btn text-white border-0">
                        <i class="bi bi-three-dots grey"></i>
                    </button>
                </div>
            </div>
            <div v-if="!isAddingNewTodo">
                <button class="add-btn d-flex gap-1 btn border-0 w-100 text-start px-1 mt-2 rounded-3" @click="()=> isAddingNewTodo=true">
                    <i class="bi bi-plus-lg"></i>
                    <span class="bg-transparent">Add a card</span>
                </button>
            </div>
            <div v-if="isAddingNewTodo">
                dd
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue';

    const lists = ref(['active', 'inProgress', 'done']);
    const isFocused = ref(false);
    const isAddingNewTodo = ref(false)

    const autoResize = (event) => {
    const el = event.target;
    el.style.height = '30px';
    el.style.height = `${el.scrollHeight}px`;
};

const onFocus = (event) => {
    isFocused.value = true;
    const textarea = event.target;
    textarea.select();
}
const onBlur = () => {
    isFocused.value = false;
};

</script>

<style lang="scss">
.list-card {
    max-width: 16.875rem;
    background: #101204;
}

.list-card-title {
    color: #b6c2cf;
}

.grey {
    color: #b6c2cf;
}

.dark-grey {
    background: #22272b;
}

textarea {
    resize: none;
    height: 30px;
    cursor: pointer;

    &.cursor-pointer {
        cursor: pointer;
    }

    &.cursor-text {
        cursor: text;
    }

    &::-webkit-scrollbar {
        display: none;
    }
}

.add-btn {
    font-size: 14px;
    color: #9fadbc;

    &:hover {
        background-color: #a6c5e229;
    }
}

</style>
