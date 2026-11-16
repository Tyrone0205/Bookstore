
let bookCollRef = document.getElementById('book-collection');
const usernameDialogRef = document.getElementById('username-dialog');
let pendingBookIndex = null;

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

                    <form class="comment-form" onsubmit="event.preventDefault(); addComment(${bookIndex})">
                        <input id="comment-input-${bookIndex}" type="text" name="comment" placeholder="Schreibe deinen Kommentar ..."
                            aria-label="Kommentar schreiben" required>
                        <button type="submit" aria-label="Kommentar senden">
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

// Benutzereingaben maskieren, damit HTML-Code nicht ausgeführt wird.
function escapeHtml(value) {
    const element = document.createElement('span');
    element.textContent = String(value);
    return element.innerHTML;
}

function getCommentTemplate(comment) {
    return `<p>
                <strong>${escapeHtml(comment.name)}:</strong>
                ${escapeHtml(comment.comment)}
            </p>`
}


function addComment(bookIndex) {
    const username = localStorage.getItem('bookstoreUserName');
    const commentInputRef = document.getElementById(`comment-input-${bookIndex}`);
    const commentText = commentInputRef.value.trim();

    if (!commentText) {
        return;
    }

    // Falls kein Benutzername existiert, Dialog öffnen.
    if (!username) {
        pendingBookIndex = bookIndex;
        openUsernameDialog();
        return;
    }

    const newComment = {
        name: username,
        comment: commentText
    };

    // Kommentar zum jeweiligen Buch hinzufügen.
    books[bookIndex].comments.push(newComment);

    renderComments(bookIndex);
    commentInputRef.value = '';
}

function saveUsername(event) {
    // Verhindert das standardmäßige Absenden des Formulars
    // und damit das mögliche Neuladen der Webseite.
    event.preventDefault();

    const username = document.getElementById('username-input').value.trim();

    if (!username) return;

    // Benutzernamen im Browser speichern.
    localStorage.setItem('bookstoreUserName', username);

    // Buchindex sichern, bevor der Dialog geschlossen wird.
    const bookIndex = pendingBookIndex;

    closeUsernameDialog();

    // Ursprünglichen Kommentar hinzufügen.
    if (bookIndex !== null) {
        addComment(bookIndex);
    }
}

function openUsernameDialog() {
    usernameDialogRef.showModal();
}

function closeUsernameDialog() {
    usernameDialogRef.close();
    pendingBookIndex = null;
}
