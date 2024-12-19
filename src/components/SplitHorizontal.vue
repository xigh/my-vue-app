<template>
    <div class="split-horizontal">
        <div class="panel top-panel" :style="{ height: topHeight + 'px' }">
            <slot name="top"></slot>
        </div>

        <div class="horizontal-resizer" @mousedown="startResize"></div>

        <div class="panel bottom-panel">
            <slot name="bottom"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['split-move'])
const props = defineProps({
    minPanelHeight: {
        type: Number,
        default: 100
    }
})

const topHeight = ref(window.innerHeight / 2)

const startResize = (e) => {
    const container = document.querySelector('.split-horizontal')
    const containerRect = container.getBoundingClientRect()
    const containerHeight = container.offsetHeight

    const resize = (e) => {
        const maxHeight = containerHeight - props.minPanelHeight
        const newHeight = e.clientY - containerRect.top
        topHeight.value = Math.min(Math.max(newHeight, props.minPanelHeight), maxHeight)
        emit('split-move')
    }

    const stopResize = () => {
        document.removeEventListener('mousemove', resize)
        document.removeEventListener('mouseup', stopResize)
    }

    document.addEventListener('mousemove', resize)
    document.addEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.split-horizontal {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.top-panel, .bottom-panel {
    min-height: v-bind('props.minPanelHeight + "px"');
    overflow: hidden;
}

.bottom-panel {
    flex-grow: 1;
}

.horizontal-resizer {
    height: 4px;
    background-color: #f00;
    cursor: row-resize;
}

.horizontal-resizer:hover {
    background-color: #999;
}
</style>