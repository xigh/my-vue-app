<template>
    <div v-if="modelValue" class="modal-overlay" @click="$emit('update:modelValue', false)">
      <div class="modal-content" @click.stop>
        <h3>Add Link</h3>
        <input 
          type="url" 
          v-model="linkUrl" 
          placeholder="Enter URL..."
          @keyup.enter="submitLink"
        >
        <div class="modal-buttons">
          <button @click="$emit('update:modelValue', false)">Cancel</button>
          <button @click="submitLink" :disabled="!linkUrl.trim()">Add</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    modelValue: Boolean
  })
  
  const emit = defineEmits(['update:modelValue', 'submit'])
  
  const linkUrl = ref('')
  
  const submitLink = () => {
    if (linkUrl.value.trim()) {
      emit('submit', linkUrl.value)
      emit('update:modelValue', false)
      linkUrl.value = ''
    }
  }
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
  </style>
