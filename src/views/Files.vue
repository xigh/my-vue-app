<template>
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

<script setup>
</script>

<style scoped>
.left-bottom {
    height: 100%;
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
