<template>
    <header>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link v-if="isTauri" to="/tauri">Tauri</router-link>
            <router-link to="/about">About</router-link>
        </nav>
    </header>
</template>

<script setup>
const isTauri = Boolean(window.__TAURI__)
console.log('Tauri status:', { isTauri, rawValue: window.__TAURI__ })
</script>

<style scoped>
header {
    background: #444;
}

nav {
    display: flex;
    padding: 2px 0 5px;
}

a {
    text-decoration: none;
    color: #f0f0f0;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

a:hover {
    background: rgba(0, 0, 0, 0.05);
}

a.router-link-active {
    background: rgba(0, 0, 0, 0.5);
    font-weight: bold;
}
</style>