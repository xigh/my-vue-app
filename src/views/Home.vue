<template>
    <div class="split-container">
        <SplitVertical :min-panel-width="100" @split-move="updateDimensions">
            <template #left>
                <SplitHorizontal :min-panel-height="150" @split-move="updateDimensions">
                    <template #top>
                        <div class="left-top" ref="leftTopRef">
                            <Chat />
                        </div>
                    </template>
                    <template #bottom>
                        <div class="left-bottom" ref="leftBottomRef">
                            <table class="files-table">
                                <thead>
                                    <tr>
                                        <td class="name">Name</td>
                                        <td class="date">Date</td>
                                        <td class="kind">Kind</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="name">document-arxiv-2024-01-01.pdf</td>
                                        <td class="date">2024-01-01</td>
                                        <td class="kind">File</td>
                                    </tr>
                                    <tr>
                                        <td class="name">audio-2024-01-01.mp3</td>
                                        <td class="date">2024-01-01</td>
                                        <td class="kind">Audio</td>
                                    </tr>
                                    <tr>
                                        <td class="name">https://arxiv.org/pdf/2401.00001</td>
                                        <td class="date">2024-01-01</td>
                                        <td class="kind">Link</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                </SplitHorizontal>
            </template>
            <template #right>
                <div class="right" ref="rightRef">
                    <!-- <h2>RIGHT {{ rightDimensions }}</h2> -->
                    <h1>Titre du document</h1>
                    <p>
                        Et ici il y aura le document généré ... soit d'une traite, soit sur plusieurs pages.
                    </p>
                    <div class="image-container">
                        <img src="https://picsum.photos/400/100" alt="Image générée">
                    </div>
                    <h2>Sous-titre</h2>
                    <p>
                        Mais comme je veux pouvoir aussi générer des powerpoints, ben on va devoir faire le boulot ici.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <h2>Autre sous-titre</h2>
                    <p>
                        Mais on pourrait tout aussi bien générer des images ... des vidéos ... des sons ... des tableaux
                        ...
                    </p>
                    <h2>Autre sous-titre</h2>
                    <ul>
                        <li>Un premier point</li>
                        <li>Un second point</li>
                        <li>Un troisième point</li>
                    </ul>
                </div>
            </template>
        </SplitVertical>
    </div>
</template>

<script setup>
import SplitVertical from '../components/SplitVertical.vue'
import SplitHorizontal from '../components/SplitHorizontal.vue'
import Chat from '../views/Chat.vue'

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
