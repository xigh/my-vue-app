<template>
    <header>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
        </nav>
    </header>
</template>

<style scoped>
header {
    background-color: #444;
    color: #fff;
}

nav a {
    color: #fff;
    text-decoration: none;

    &+a {
        padding-left: 10px;
    }
}

nav a.router-link-active {
    color: #42b983;
}
</style>