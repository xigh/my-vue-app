
.right {
    height: 100%;
    padding: 10px;
    overflow-y: auto;

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
