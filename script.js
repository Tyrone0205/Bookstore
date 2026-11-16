let bookCollRef = document.getElementById('book-collection');

function renderBooks() {

    bookCollRef.innerHTML = '';

    for (let bookIndex = 0; bookIndex < books.length; bookIndex++) {
        const book = books[bookIndex];

        bookCollRef += getBookTemplate(book);
    }
}