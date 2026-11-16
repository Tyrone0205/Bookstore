
let bookCollRef = document.getElementById('book-collection');
const usernameDialogRef = document.getElementById('username-dialog');
let pendingBookIndex = null;
const storageKey = "bookData";

// Speichert das gesamte books-Array als JSON-String im localStorage.
function saveToLocalStorage() {
    localStorage.setItem(storageKey, JSON.stringify(books));
}

// Lädt die gespeicherten Buchdaten aus dem localStorage.
function getFromLocalStorage() {
    const savedData = localStorage.getItem(storageKey);

    // Beim ersten Besuch existieren noch keine gespeicherten Daten.
    if (savedData === null) {
        return;
    }

    try {
        // JSON-String wieder in ein JavaScript-Array umwandeln.
        const data = JSON.parse(savedData);

        // Überprüfen, ob es sich um ein gültiges Array mit Buchobjekten handelt.
        if (!Array.isArray(data) || !data.every(book =>
            book !== null &&
            typeof book === 'object' &&
            Array.isArray(book.comments) &&
            typeof book.likes === 'number' &&
            typeof book.liked === 'boolean'
        )) {
            return;
        }

        // Gespeicherte Bücher übernehmen.
        books = data;

    } catch (error) {
        // Fehlerhafte JSON-Daten abfangen.
        console.error('Fehler beim Laden der Buchdaten:', error);
    }
}

// Initialisierung beim Laden der Webseite.
function init() {
    getFromLocalStorage();
    renderBooks();
}

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
                        <span class="book-price">${book.price.toFixed(2)} €</span>

                        <div class="book-likes">
                            <span id="like-counter-${bookIndex}">${book.likes}</span>

                            <button
                                id="like-button-${bookIndex}"
                                class="like-button ${book.liked ? 'liked' : ''}"
                                type="button"
                                aria-label="Gefällt mir für ${escapeHtml(book.name)}"
                                aria-pressed="${book.liked}"
                                onclick="toggleLike(${bookIndex})">
                                ❤
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

                    <div id="comments-list-${bookIndex}"
                        class="comments-list"
                        role="region"
                        aria-label="Kommentare zu ${escapeHtml(book.name)}"
                        tabindex="0">
                    </div>


                    <form class="comment-form"
                        onsubmit="event.preventDefault(); addComment(${bookIndex})">

                        <label class="visually-hidden"
                            for="comment-input-${bookIndex}">
                            Kommentar zu ${escapeHtml(book.name)} schreiben
                        </label>

                        <input id="comment-input-${bookIndex}"
                            type="text"
                            name="comment"
                            placeholder="Schreibe deinen Kommentar ..."
                            required>

                        <button type="submit"
                                aria-label="Kommentar zu ${escapeHtml(book.name)} senden">
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

    // Aktualisierte Buchdaten dauerhaft speichern.
    saveToLocalStorage();

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

// Setzt den Buchindex auch beim Schließen mit Escape zurück.
usernameDialogRef.addEventListener('close', () => {
    pendingBookIndex = null;
});


function closeUsernameDialogOutside(event) {
    // Nur Klicks auf das Dialogelement selbst berücksichtigen.
    if (event.target !== usernameDialogRef) {
        return;
    }

    // Position und Größe des Dialogs ermitteln.
    const rect = usernameDialogRef.getBoundingClientRect();

    // Überprüfen, ob außerhalb des sichtbaren Dialogs geklickt wurde.
    const isOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

    if (isOutside) {
        closeUsernameDialog();
    }
}



function toggleLike(bookIndex) {
    const book = books[bookIndex];

    const likeCounterRef = document.getElementById(`like-counter-${bookIndex}`);
    const likeButtonRef = document.getElementById(`like-button-${bookIndex}`);

    // Like-Status überprüfen und entsprechend ändern.
    if (book.liked === false) {
        book.liked = true;
        book.likes++;
    } else {
        book.liked = false;
        book.likes--;
    }

    // Aktualisierte Buchdaten dauerhaft speichern.
    saveToLocalStorage();

    // CSS-Klasse entsprechend dem Like-Status hinzufügen oder entfernen.
    likeButtonRef.classList.toggle('liked', book.liked);

    // Herzsymbol und Like-Counter aktualisieren.
    likeCounterRef.textContent = book.likes;

    // Like-Status für Screenreader aktualisieren.
    likeButtonRef.setAttribute('aria-pressed', book.liked);
}

