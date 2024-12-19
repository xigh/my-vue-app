<template>
    <h1>Welcome to Vue 3</h1>
    <div class="counter">
        <p>Count: {{ count }}</p>
        <button @click="increment">Increment</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>

<style scoped>
.home {
  text-align: center;
}

.counter {
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
