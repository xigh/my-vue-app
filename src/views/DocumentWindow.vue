<template>
    <Document />
</template>

<script setup>
import Document from './Document.vue'
import { onMounted, onBeforeUnmount } from 'vue'

// Établir la communication avec la fenêtre parente
onMounted(() => {
    // Écouter les messages de la fenêtre principale
    window.addEventListener('message', handleMessage)
    
    // Écouter la fermeture de la fenêtre
    window.addEventListener('beforeunload', () => {
        window.opener.postMessage({ type: 'WINDOW_CLOSING' }, window.location.origin)
    })
})

const handleMessage = (event) => {
    // Vérifier l'origine pour la sécurité
    if (event.origin !== window.location.origin) return

    switch (event.data.type) {
        case 'INIT':
            console.log('Communication established with main window')
            break
        // Ajouter d'autres cas selon vos besoins
    }
}

onBeforeUnmount(() => {
    window.removeEventListener('message', handleMessage)
})
</script>

<style>
body {
    margin: 0;
    padding: 0;
}
</style>
