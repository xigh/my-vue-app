<template>
    <Suspense>
        <div class="app">
            <Header />
            <main>
                <router-view></router-view>
            </main>
            <Footer />
            
            <!-- Confirmation Modal -->
            <div v-if="showQuitModal" class="modal-overlay">
                <div class="modal">
                    <h2>Confirm Exit</h2>
                    <p>Are you sure you want to quit?</p>
                    <div class="modal-actions">
                        <button @click="quitApp">Yes, quit</button>
                        <button @click="showQuitModal = false">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        
        <template #fallback>
            <div class="loading">Loading...</div>
        </template>
    </Suspense>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const showQuitModal = ref(false)

// Check if we're running in Tauri
const isTauri = Boolean(window.__TAURI__)

// Only import Tauri APIs if we're in Tauri environment
let Window
if (isTauri) {
    const tauriWindow = await import('@tauri-apps/api/window')
    Window = tauriWindow.Window
}

const handleKeydown = async (e) => {
    if (e.key === 'Escape' && isTauri) {
        showQuitModal.value = true
    }
}

const quitApp = async () => {
    if (isTauri) {
        alert('Quitting app in Tauri environment')
        await window.__TAURI__.process.exit(0)
    }
}

onMounted(() => {
    if (isTauri) {
        window.addEventListener('keydown', handleKeydown)
    }
})

onBeforeUnmount(() => {
    if (isTauri) {
        window.removeEventListener('keydown', handleKeydown)
    }
})
</script>

<style>
* {
    margin: 0;
    padding: 0;
    font: inherit;
    box-sizing: border-box; 
}

html,
body {
    font-family: 'Arial', sans-serif;
    height: 100vh;
    overflow: hidden;
}

#app {
    height: 100vh;
    overflow: hidden;
}
</style>

<style scoped>
.app {
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

main {
    height: 100%;
    overflow: hidden;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    min-width: 300px;
}

.modal h2 {
    margin-bottom: 10px;
    font-size: 1.2em;
    font-weight: bold;
}

.modal p {
    margin-bottom: 20px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.modal-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.modal-actions button:first-child {
    background-color: #dc3545;
    color: white;
}

.modal-actions button:last-child {
    background-color: #6c757d;
    color: white;
}

.modal-actions button:hover {
    opacity: 0.9;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
}
</style>