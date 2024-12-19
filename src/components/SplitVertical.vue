<template>
    <div class="split-vertical">
        <div class="panel left-panel" :style="{ width: leftWidth + 'px' }">
            <slot name="left"></slot>
        </div>

        <div class="resizer" @mousedown="startResize"></div>

        <div class="panel right-panel">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['split-move'])
const props = defineProps({
    minPanelWidth: {
        type: Number,
        default: 100
    }
})

const leftWidth = ref(window.innerWidth / 2)

const startResize = (e) => {
    const container = document.querySelector('.split-vertical')
    const containerWidth = container.offsetWidth

    const resize = (e) => {
        const maxWidth = containerWidth - props.minPanelWidth
        leftWidth.value = Math.min(Math.max(e.clientX, props.minPanelWidth), maxWidth)
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
.split-vertical {
    display: flex;
    width: 100%;
    height: 100%;
}

.left-panel, .right-panel {
    min-width: v-bind('props.minPanelWidth + "px"');
    overflow: hidden;
}

.right-panel {
    flex-grow: 1;
}

.resizer {
    width: 4px;
    background-color: #000;
    cursor: col-resize;
}

.resizer:hover {
    background-color: #999;
}
</style>
