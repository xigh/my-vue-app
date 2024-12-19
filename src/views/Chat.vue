<template>
    <div class="chat-container">
        <div class="messages-container" ref="messagesContainer">
            <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
                <div class="message-content markdown-body" v-html="renderMarkdown(message.content)"></div>
            </div>
        </div>
        <div class="input-container">
            <div class="upload-buttons">
                <button class="upload-btn" @click="handleFileUpload">
                    <input type="file" ref="fileInput" @change="onFileSelected" hidden>
                    📎 File
                </button>
                <button class="upload-btn" @click="handleLinkInput">🔗 Link</button>
                <button class="upload-btn" @click="handleAudioRecord">🎤 Record</button>
            </div>
            <div class="input-row">
                <textarea
                    v-model="newMessage"
                    @keydown.enter.prevent="sendMessage"
                    placeholder="Type your message (Markdown supported)..."
                    rows="3"
                ></textarea>
                <button @click="sendMessage" :disabled="!newMessage.trim()">Send</button>
            </div>
        </div>
        <LinkModal 
            v-model="showLinkModal" 
            @submit="onLinkSubmit"
        />
        <AudioRecordModal 
            v-model="showAudioModal" 
            @submit="onAudioSubmit"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import LinkModal from '../components/LinkModal.vue'
import AudioRecordModal from '../components/AudioRecordModal.vue'

const messages = ref([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
])
const newMessage = ref('')
const messagesContainer = ref(null)
const fileInput = ref(null)
const showLinkModal = ref(false)
const showAudioModal = ref(false)

const renderMarkdown = (content) => {
    return DOMPurify.sanitize(marked(content))
}

const scrollToBottom = async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const sendMessage = async () => {
    if (!newMessage.value.trim()) return
    
    // Add user message
    messages.value.push({
        role: 'user',
        content: newMessage.value
    })
    
    // Clear input
    newMessage.value = ''
    
    await scrollToBottom()
    
    // Simulate assistant response (replace with actual API call)
    setTimeout(() => {
        messages.value.push({
            role: 'assistant',
            content: 'This is a sample response that supports **markdown** and `code blocks`.'
        })
        scrollToBottom()
    }, 1000)
}

const handleFileUpload = () => {
    fileInput.value.click()
}

const onFileSelected = (event) => {
    const file = event.target.files[0]
    if (file) {
        // Handle the file upload here
        console.log('File selected:', file)
    }
}

const handleLinkInput = () => {
    showLinkModal.value = true
}

const onLinkSubmit = (url) => {
    // Handle the submitted URL here
    console.log('Link submitted:', url)
}

const handleAudioRecord = () => {
    showAudioModal.value = true
}

const onAudioSubmit = (audioBlob) => {
    // Handle the recorded audio blob here
    console.log('Audio recorded:', audioBlob)
    // You might want to convert it to base64 or upload it to a server
}

onMounted(() => {
    scrollToBottom()
})
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
}

.messages-container {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.message {
    max-width: 80%;
    padding: 0.8rem;
    border-radius: 8px;
}

.message.user {
    align-self: flex-end;
    background-color: #007bff;
    color: white;
}

.message.assistant {
    align-self: flex-start;
    background-color: #f0f0f0;
    color: black;
}

.input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-row {
    display: flex;
    gap: 0.5rem;
}

textarea {
    flex-grow: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
    font-family: inherit;
}

button {
    align-self: stretch;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Markdown Styles */
:deep(.markdown-body) {
    line-height: 1.5;
}

:deep(.markdown-body code) {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
}

:deep(.markdown-body pre) {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
}

:deep(.message.user .markdown-body code) {
    background-color: rgba(255, 255, 255, 0.2);
}

.upload-buttons {
    display: flex;
    gap: 0.5rem;
}

.upload-btn {
    padding: 0.5rem;
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.upload-btn:hover {
    background-color: #e0e0e0;
}
</style>
