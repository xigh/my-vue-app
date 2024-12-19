<template>
    <div class="app">
        <Header />
        <main>
            <router-view></router-view>
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style>
* {
    margin: 0;
    padding: 0;
    font: inherit;
}

html,
body {
    font-family: 'Arial', sans-serif;
    height: 100%;
}
</style>

<style scoped>
.app {
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    min-height: 100vh;
    width: 100%;
}

main {
    height: 100%;
}
</style>