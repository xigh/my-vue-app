<template>
    <div class="split-container">
        <SplitVertical :min-panel-width="100" @split-move="updateDimensions">
            <template #left>
                <SplitHorizontal :min-panel-height="150" @split-move="updateDimensions">
                    <template #top>
                        <div class="left-top" ref="leftTopRef">
                            <h2>LEFT-TOP {{ leftTopDimensions }}</h2>
                        </div>
                    </template>
                    <template #bottom>
                        <div class="left-bottom" ref="leftBottomRef">
                            <h2>LEFT-BOTTOM {{ leftBottomDimensions }}</h2>
                        </div>
                    </template>
                </SplitHorizontal>
            </template>
            <template #right>
                <div class="right" ref="rightRef">
                    <h2>RIGHT {{ rightDimensions }}</h2>
                </div>
            </template>
        </SplitVertical>
    </div>
</template>

<script setup>
import SplitVertical from '../components/SplitVertical.vue'
import SplitHorizontal from '../components/SplitHorizontal.vue'

import { ref, onMounted, computed, nextTick } from 'vue'

const leftTopRef = ref(null)
const leftBottomRef = ref(null)
const rightRef = ref(null)
const updateTrigger = ref(0)

const getDimensions = (element) => {
    if (!element) return ''
    updateTrigger.value; // big kludge to force re-render
    const rect = element.getBoundingClientRect()
    return `(${Math.round(rect.width)}x${Math.round(rect.height)})`
}

const leftTopDimensions = computed(() => getDimensions(leftTopRef.value))
const leftBottomDimensions = computed(() => getDimensions(leftBottomRef.value))
const rightDimensions = computed(() => getDimensions(rightRef.value))

const updateDimensions = () => {
    updateTrigger.value++; // big kludge to force re-render
}

// Update dimensions on window resize and split moves
onMounted(() => {
    window.addEventListener('resize', updateDimensions)
})
</script>

<style scoped>
.split-container {
    height: 100%;
}

.left-top {
    height: 100%;
    background-color: #f80;
}

.left-bottom {
    height: 100%;
    background-color: #ff0;
}

.right {
    height: 100%;
    background-color: #0f0;
}
</style>
