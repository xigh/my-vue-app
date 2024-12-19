<template>
    <div class="tauri-info">
        <h1>Tauri Information</h1>
        <div class="info-grid">
            <div class="info-item">
                <strong>Version:</strong>
                <span>{{ version }}</span>
            </div>
            <div class="info-item">
                <strong>Platform:</strong>
                <span>{{ platform }}</span>
            </div>
            <div class="info-item">
                <strong>OS Type:</strong>
                <span>{{ osType }}</span>
            </div>
            <div class="info-item">
                <strong>OS Version:</strong>
                <span>{{ osVersion }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getVersion } from '@tauri-apps/api/app'
// import { platform, type, version as osVersionApi } from '@tauri-apps/api/os'

const version = ref('Loading...')
const platformInfo = ref('Loading...')
const osType = ref('Loading...')
const osVersion = ref('Loading...')

const isTauri = Boolean(window.__TAURI__)

onMounted(async () => {
    if (!isTauri) {
        console.error('Tauri is not available in this environment')
        return
    }

    const getVersion = window.__TAURI__.os.getVersion;
    const platform = window.__TAURI__.os.platform;
    const type = window.__TAURI__.os.type;
    const osVersionApi = window.__TAURI__.os.version;

    try {
        version.value = await getVersion()
        platformInfo.value = await platform()
        osType.value = await type()
        osVersion.value = await osVersionApi()
    } catch (e) {
        console.error('Error loading Tauri info:', e)
    }
})
</script>

<style scoped>
.tauri-info {
    padding: 20px;
}

.info-grid {
    display: grid;
    gap: 20px;
    margin-top: 20px;
}

.info-item {
    background: rgba(0, 0, 0, 0.05);
    padding: 15px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-item strong {
    font-weight: bold;
}
</style>
