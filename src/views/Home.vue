<template>
    <div class="split-container">
        <SplitVertical v-if="!isUndocked" :min-panel-width="100" :initial-split="verticalSplit" @split-update="updateVerticalSplit" @split-move="updateDimensions">
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
                    <button class="undock-button" @click="undockRight">
                        <span class="material-icons">open_in_new</span>
                    </button>
                    <Document />
                </div>
            </template>
        </SplitVertical>

        <div v-else class="docked-left">
            <SplitHorizontal :min-panel-height="150" :initial-split="horizontalSplit" @split-update="updateHorizontalSplit">
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
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, markRaw } from 'vue'
import SplitVertical from '../components/SplitVertical.vue'
import SplitHorizontal from '../components/SplitHorizontal.vue'
import Chat from '../views/Chat.vue'
import Files from '../views/Files.vue'
import Document from '../views/Document.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const isUndocked = ref(false)
let undockedWindow = null

const undockRight = () => {
    isUndocked.value = true
    
    const url = window.location.origin + '/document-window'
    const windowFeatures = [
        'width=800',
        'height=600',
        'location=no',      // Cache la barre d'adresse
        'menubar=no',       // Cache le menu
        'toolbar=no',       // Cache la barre d'outils
        'status=no',        // Cache la barre de statut
        'directories=no'    // Cache les boutons de navigation
    ].join(',')
    
    undockedWindow = window.open(url, 'DocumentWindow', windowFeatures)
    
    // Écouter les messages de la fenêtre détachée
    window.addEventListener('message', handleMessage)
    
    // Envoyer un message initial pour établir la communication
    undockedWindow.addEventListener('load', () => {
        undockedWindow.postMessage({ type: 'INIT' }, window.location.origin)
    })
}

const handleMessage = (event) => {
    // Vérifier l'origine pour la sécurité
    if (event.origin !== window.location.origin) return

    switch (event.data.type) {
        case 'WINDOW_CLOSING':
            isUndocked.value = false
            undockedWindow = null
            // Nettoyer l'écouteur de message
            window.removeEventListener('message', handleMessage)
            break
        // Ajouter d'autres cas selon vos besoins
    }
}

// Nettoyer lors de la destruction du composant
onBeforeUnmount(() => {
    if (undockedWindow) {
        undockedWindow.close()
    }
    window.removeEventListener('message', handleMessage)
    saveLayout()
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

.docked-left {
    height: 100%;
    width: 100%;
}

.undock-button {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    padding: 5px;
    cursor: pointer;
    background: transparent;
    border: none;
    opacity: 0.6;
}

.undock-button .material-icons {
    color: white;
}

.undock-button:hover {
    opacity: 1;
}
</style>
