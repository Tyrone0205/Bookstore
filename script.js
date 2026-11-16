let bookCollRef = document.getElementById('book-collection');

function renderBooks() {

    bookCollRef.innerHTML = '';

    for (let bookIndex = 0; bookIndex < books.length; bookIndex++) {
        const book = books[bookIndex];
        book.comments

        bookCollRef += getBookTemplate(book, bookIndex);

    }
}

function getBookTemplate(book, bookIndex) {
    return `<article class="book-card">
                <section class="book-header">
                    <h2>${book.name}</h2>
                </section>

                <div class="book-image">
                    <img src="${book.picture}" alt="Buchcover von ${book.name}">
                </div>

                <section class="book-information">

                    <div class="book-price-likes">
                        <span class="book-price">${book.price} €</span>

                        <div class="book-likes">
                            <span>${book.likes}</span>
                            <button type="button" aria-label="Buch liken">
                                ♡
                            </button>
                        </div>
                    </div>

                    <dl class="book-details">
                        <dt>Autor</dt>
                        <dd>${book.author}</dd>

                        <dt>Erscheinungsjahr</dt>
                        <dd>${book.publishedYear}</dd>

                        <dt>Genre</dt>
                        <dd>${book.genre}</dd>
                    </dl>

                </section>

                <section class="book-comments">
                    <h3>Kommentare:</h3>

                    <div id="comments-list-${bookIndex}" class="comments-list">
                        <p><strong>Kevin:</strong> asdasd</p>
                        <p><strong>Kevin:</strong> asdasdasdasd</p>
                        <p>
                            <strong>Leser123:</strong>
                            Ein faszinierendes Abenteuerbuch,
                            das mich von der ersten Seite an
                            gefesselt hat.
                        </p>
                    </div>

                    <form class="comment-form">
                        <input type="text" name="comment" placeholder="Schreibe deinen Kommentar ..."
                            aria-label="Kommentar schreiben" required>
                        <button type="submit" aria-label="Kommentar senden" onclick="addComment()">
                            ➤
                        </button>
                    </form>

                </section>
            </article>`
}

function renderComments(bookIndex) {
    let comments = books[bookIndex].comments;
    let commentsRef = document.getElementById(`comments-list-${bookIndex}`)
    commentsRef.innerHTML = '';

    for (let commentIndex = 0; commentIndex < comments.length; commentIndex++) {
        const comment = comments[commentIndex];
        commentsRef += getCommentTemplate(comment);  
    }
}

function getCommentTemplate(comment) {
    return `<p>
                <strong>${comment.name}:</strong>
                ${comment.comment}
            </p>`
}