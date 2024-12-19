<template>
    <div class="split-container">
        <SplitVertical :min-panel-width="100" :initial-split="verticalSplit" @split-update="updateVerticalSplit" @split-move="updateDimensions">
            <template #left>
                <SplitHorizontal :min-panel-height="150" :initial-split="horizontalSplit" @split-update="updateHorizontalSplit" @split-move="updateDimensions">
                    <template #top>
                        <div class="left-top">
                            <Chat />
                        </div>
                    </template>
                    <template #bottom>
                        <div class="left-bottom">
                            <Files />
                        </div>
                    </template>
                </SplitHorizontal>
            </template>
            <template #right>
                <div class="right">
                    <Document />
                </div>
            </template>
        </SplitVertical>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SplitVertical from '../components/SplitVertical.vue'
import SplitHorizontal from '../components/SplitHorizontal.vue'
import Chat from '../views/Chat.vue'
import Files from '../views/Files.vue'
import Document from '../views/Document.vue'

// Récupérer les positions sauvegardées ou utiliser les valeurs par défaut
const savedLayout = JSON.parse(localStorage.getItem('splitLayout') || '{}')
const verticalSplit = ref(savedLayout.vertical || 0.5)
const horizontalSplit = ref(savedLayout.horizontal || 0.5)

// Mettre à jour le localStorage quand les splits changent
const updateVerticalSplit = (ratio) => {
  verticalSplit.value = ratio
  saveLayout()
}

const updateHorizontalSplit = (ratio) => {
  horizontalSplit.value = ratio
  saveLayout()
}

const saveLayout = () => {
  localStorage.setItem('splitLayout', JSON.stringify({
    vertical: verticalSplit.value,
    horizontal: horizontalSplit.value
  }))
}

// Sauvegarder avant de quitter la page
onBeforeUnmount(() => {
  saveLayout()
})

// Pour gérer le redimensionnement de la fenêtre
const updateDimensions = () => {
  // Trigger un recalcul des dimensions si nécessaire
}

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
    padding: 10px;
    overflow-y: auto;
}

.left-bottom {
    height: 100%;
    overflow-y: auto;
}
</style>
