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
                        <Files />
                    </template>
                </SplitHorizontal>
            </template>
            <template #right>
                <Document />
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
}

.left-bottom {
    height: 100%;
    /* background-color: #ff0; */
}

.right {
    height: 100%;
    padding: 10px;

    ul, ol {
        padding-left: 20px;
    }

    ul {
        list-style-type: square;
        list-style-position: inside;
    }

    li {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 5px;
    }

    li + li {
        margin-top: 5px;
    }

    p,
    ul,
    ol,
    h1,
    h2,
    h3,
    h4,
    h5,
    div,
    h6 {
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 5px;
    }

    p:hover,
    ul:hover,
    li:hover,
    ol:hover,
    h1:hover,
    h2:hover,
    h3:hover,
    h4:hover,
    h5:hover,
    h6:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    > * + * {
        margin-top: 10px;
    }

    p+p {
        margin-top: 10px;
    }

    h1 {
        font-size: 1.5em;
        font-weight: bold;
    }

    h2 {
        font-size: 1.2em;
        font-weight: bold;
    }

    h3 {
        font-size: 1em;
        font-weight: bold;
    }
}

.files-table {
    width: 100%;
    border-collapse: collapse;

    td {
        padding: 5px;
    }

    thead {
        background-color: #444;
        color: #fff;
    }

    tbody {
        tr td {
            border-bottom: 1px solid #444;
        }

        tr:nth-child(even) {
            background-color: rgba(0, 0, 0, 0.05);
        }

        tr:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }

    .name {
        width: auto;
    }

    .date {
        width: 100px;
    }

    .kind {
        width: 100px;
    }
}
</style>
