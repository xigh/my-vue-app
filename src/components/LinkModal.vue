<template>
    <div v-if="modelValue" class="modal-overlay" @click="$emit('update:modelValue', false)">
      <div class="modal-content" @click.stop>
        <h3>Add Link</h3>
        <input 
          type="url" 
          v-model="linkUrl" 
          placeholder="Enter URL..."
          @keyup.enter="submitLink"
          @input="debouncedFetchMetadata"
        >
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="loading" class="preview-loading">
          Loading preview...
        </div>
        <div v-else-if="preview.title || preview.image" class="link-preview">
          <img v-if="preview.image" :src="preview.image" alt="Site preview">
          <div v-if="preview.title" class="preview-title">{{ preview.title }}</div>
          <div v-if="preview.description" class="preview-description">{{ preview.description }}</div>
        </div>
        <div class="modal-buttons">
          <button @click="$emit('update:modelValue', false)">Cancel</button>
          <button @click="submitLink" :disabled="!linkUrl.trim()">Add</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    modelValue: Boolean
  })
  
  const emit = defineEmits(['update:modelValue', 'submit'])
  
  const linkUrl = ref('')
  const loading = ref(false)
  const preview = ref({ title: '', image: '', description: '' })
  const error = ref('')
  
  const submitLink = () => {
    if (linkUrl.value.trim()) {
      emit('submit', linkUrl.value)
      emit('update:modelValue', false)
      linkUrl.value = ''
    }
  }
  
  const fetchMetadata = async (url) => {
    if (!url.trim()) {
      preview.value = { title: '', image: '', description: '' }
      error.value = ''
      return
    }

    console.log('Fetching metadata for:', url)

    loading.value = true
    error.value = ''
    try {
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch metadata')
      }
      const data = await response.json()
      preview.value = {
        title: data.title || '',
        image: data.image || '',
        description: data.description || ''
      }
    } catch (err) {
      console.error('Error fetching metadata:', err)
      preview.value = { title: '', image: '', description: '' }
      error.value = 'Failed to load preview. Please check the URL and try again.'
    } finally {
      loading.value = false
    }
  }
  
  const debounce = (fn, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }
  
  const debouncedFetchMetadata = debounce(() => fetchMetadata(linkUrl.value), 1000)
  
  // Surveiller les changements de modelValue pour réinitialiser les états
  watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
      // Réinitialiser les états quand la modal se ferme
      linkUrl.value = ''
      preview.value = { title: '', image: '' }
      error.value = ''
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    min-width: 600px;
    max-width: 90%;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:first-child {
    background-color: #f0f0f0;
    color: #333;
  }
  
  button:last-child {
    background-color: #007bff;
    color: white;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .link-preview {
    margin: 1rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
  }
  
  .link-preview img {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    margin-bottom: 0.5rem;
  }
  
  .preview-title {
    font-weight: bold;
  }
  
  .preview-loading {
    margin: 1rem 0;
    color: #666;
    font-style: italic;
  }
  
  .error-message {
    color: #dc3545;
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }
  </style>
