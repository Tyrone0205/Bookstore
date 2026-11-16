let bookCollRef = document.getElementById('book-collection');
const usernameDialogRef = document.getElementById('username-dialog');

function renderBooks() {

    bookCollRef.innerHTML = '';

    for (let bookIndex = 0; bookIndex < books.length; bookIndex++) {
        const book = books[bookIndex];

        // Erst die Buchkarte im DOM erstellen
        /*
        * innerHTML += liest den bisherigen HTML-Inhalt und erstellt alle
        * Kind-Elemente beim Anhängen erneut (Event-Listener gehen verloren).
        * insertAdjacentHTML('beforeend', ...) fügt neuen HTML-Code am Ende
        * hinzu, ohne bestehende Elemente neu zu erstellen.
        * Dadurch ist es bei vielen Einträgen meist performanter.
        */
        bookCollRef.insertAdjacentHTML('beforeend', getBookTemplate(book, bookIndex));

        // Danach die Kommentare des jeweiligen Buches rendern
        renderComments(bookIndex);

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

                    </div>

                    <form class="comment-form">
                        <input id="comment-input-${bookIndex}" type="text" name="comment" placeholder="Schreibe deinen Kommentar ..."
                            aria-label="Kommentar schreiben" required>
                        <button type="submit" aria-label="Kommentar senden" onclick="addComment(${bookIndex})">
                            ➤
                        </button>
                    </form>

                </section>
            </article>`
}


function renderComments(bookIndex) {
    let comments = books[bookIndex].comments;
    let commentsRef = document.getElementById(`comments-list-${bookIndex}`);

    commentsRef.innerHTML = '';

    for (let commentIndex = 0; commentIndex < comments.length; commentIndex++) {
        const comment = comments[commentIndex];

        commentsRef.insertAdjacentHTML('beforeend', getCommentTemplate(comment));
    }
}

function getCommentTemplate(comment) {
    return `<p>
                <strong>${comment.name}:</strong>
                ${comment.comment}
            </p>`
}


function addComment(bookIndex) {

    const username = localStorage.getItem('bookstoreUserName');

    if (!username) {
        openUsernameDialog();
        return;
    }

    const commentInputRef = document.getElementById(`comment-input-${bookIndex}`);
    const commentText = commentInputRef.value.trim();

    // Leere Kommentare verhindern
    if (!commentText) return;

    // Neues Kommentarobjekt erstellen
    const newComment = {
        name: username,
        comment: commentText
    };

    // Kommentar zum richtigen Buch hinzufügen
    books[bookIndex].comments.push(newComment);

    // Kommentare des jeweiligen Buches neu rendern
    renderComments(bookIndex);

    // Eingabefeld zurücksetzen
    commentInputRef.value = '';
}

function openUsernameDialog() {
    usernameDialogRef.openModal();
}

function closeUsernameDialog() {
    usernameDialogRef.close();
}