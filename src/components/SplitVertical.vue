<template>
    <div class="split-container" ref="container">
        <div class="left-panel" :style="{ width: leftWidth + 'px' }">
            <slot name="left"></slot>
        </div>
        <div class="divider" @mousedown="startDragging"></div>
        <div class="right-panel" :style="{ width: rightWidth + 'px' }">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
    minPanelWidth: {
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
const leftWidth = ref(0)
const rightWidth = ref(0)
const isDragging = ref(false)

const updateWidths = (containerWidth, splitRatio) => {
    if (!containerWidth) return  // Protection contre les valeurs invalides
    
    const newLeftWidth = Math.max(
        props.minPanelWidth, 
        Math.min(
            containerWidth - props.minPanelWidth, 
            Math.round(containerWidth * splitRatio)
        )
    )
    
    // Ne mettre à jour que si les valeurs changent réellement
    if (leftWidth.value !== newLeftWidth) {
        leftWidth.value = newLeftWidth
        rightWidth.value = containerWidth - newLeftWidth - 4  // Soustraction de la largeur du divider
        emit('split-update', newLeftWidth / containerWidth)
    }
}

const startDragging = (e) => {
    isDragging.value = true
    const startX = e.clientX
    const startLeftWidth = leftWidth.value

    const doDrag = (e) => {
        const deltaX = e.clientX - startX
        const containerWidth = container.value.offsetWidth
        const newLeftWidth = startLeftWidth + deltaX
        const splitRatio = newLeftWidth / containerWidth
        updateWidths(containerWidth, splitRatio)
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
    let lastWidth = 0
    const resizeObserver = new ResizeObserver((entries) => {
        if (!isDragging.value && container.value) {
            const containerWidth = container.value.offsetWidth
            // Ne mettre à jour que si la largeur a réellement changé
            if (containerWidth !== lastWidth) {
                lastWidth = containerWidth
                const currentRatio = leftWidth.value / containerWidth
                updateWidths(containerWidth, currentRatio)
            }
        }
    })

    if (container.value) {
        resizeObserver.observe(container.value)
        const containerWidth = container.value.offsetWidth
        lastWidth = containerWidth
        updateWidths(containerWidth, props.initialSplit)
    }

    return () => resizeObserver.disconnect()
})
</script>

<style scoped>
.split-container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.left-panel, .right-panel {
    min-width: v-bind('props.minPanelWidth + "px"');
    overflow: auto;
    height: 100%;
    flex-shrink: 0;  /* Empêche les panels de rétrécir */
}

.right-panel {
    flex-grow: 1;
}

.divider {
    width: 4px;
    background-color: #000;
    cursor: col-resize;
    flex: none;
}

.divider:hover {
    background-color: #999;
}
</style>
