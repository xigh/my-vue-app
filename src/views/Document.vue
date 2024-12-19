<template>
    <div class="right" ref="rightRef">
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

<script setup>
</script>

<style scoped>
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
</style>
