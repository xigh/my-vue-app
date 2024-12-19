<template>
    <div class="split-container" ref="container">
        <div class="top-panel" :style="{ height: topHeight + 'px' }">
            <slot name="top"></slot>
        </div>
        <div class="divider" @mousedown="startDragging"></div>
        <div class="bottom-panel" :style="{ height: bottomHeight + 'px' }">
            <slot name="bottom"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    minPanelHeight: {
        type: Number,
        default: 100
    },
    initialSplit: {
        type: Number,
        default: 0.5
    }
})

const emit = defineEmits(['split-move', 'split-update'])

const container = ref(null)
const topHeight = ref(0)
const bottomHeight = ref(0)
const isDragging = ref(false)

const updateHeights = (containerHeight, splitRatio) => {
    if (!containerHeight) return  // Protection contre les valeurs invalides
    
    const newTopHeight = Math.max(
        props.minPanelHeight, 
        Math.min(
            containerHeight - props.minPanelHeight, 
            Math.round(containerHeight * splitRatio)
        )
    )
    
    // Ne mettre à jour que si les valeurs changent réellement
    if (topHeight.value !== newTopHeight) {
        topHeight.value = newTopHeight
        bottomHeight.value = containerHeight - newTopHeight - 4  // Soustraction de la hauteur du divider
        emit('split-update', newTopHeight / containerHeight)
    }
}

const startDragging = (e) => {
    isDragging.value = true
    const startY = e.clientY
    const startTopHeight = topHeight.value

    const doDrag = (e) => {
        const deltaY = e.clientY - startY
        const containerHeight = container.value.offsetHeight
        const newTopHeight = startTopHeight + deltaY
        const splitRatio = newTopHeight / containerHeight
        updateHeights(containerHeight, splitRatio)
        emit('split-move')
    }

    const stopDrag = () => {
        isDragging.value = false
        document.removeEventListener('mousemove', doDrag)
        document.removeEventListener('mouseup', stopDrag)
    }

    document.addEventListener('mousemove', doDrag)
    document.addEventListener('mouseup', stopDrag)
}

onMounted(() => {
    let lastHeight = 0
    const resizeObserver = new ResizeObserver((entries) => {
        if (!isDragging.value && container.value) {
            const containerHeight = container.value.offsetHeight
            // Ne mettre à jour que si la hauteur a réellement changé
            if (containerHeight !== lastHeight) {
                lastHeight = containerHeight
                const currentRatio = topHeight.value / containerHeight
                updateHeights(containerHeight, currentRatio)
            }
        }
    })

    if (container.value) {
        resizeObserver.observe(container.value)
        const containerHeight = container.value.offsetHeight
        lastHeight = containerHeight
        updateHeights(containerHeight, props.initialSplit)
    }

    return () => resizeObserver.disconnect()
})
</script>

<style scoped>
.split-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.top-panel, .bottom-panel {
    min-height: v-bind('props.minPanelHeight + "px"');
    overflow: auto;
    width: 100%;
    flex-shrink: 0;  /* Empêche les panels de rétrécir */
}

.divider {
    height: 4px;
    background-color: #000;
    cursor: row-resize;
    flex: none;
}

.divider:hover {
    background-color: #999;
}
</style>