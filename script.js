
let bookCollRef = document.getElementById('book-collection');
const usernameDialogRef = document.getElementById('username-dialog');
let pendingBookIndex = null;
const storageKey = "bookData";
let showLikedOnly = false;

// Speichert das gesamte books-Array als JSON-String im localStorage.
function saveToLocalStorage() {
    localStorage.setItem(storageKey, JSON.stringify(books));
}

// Lädt und überprüft die gespeicherten Buchdaten aus dem localStorage.
function getFromLocalStorage() {
    const savedData = localStorage.getItem(storageKey);

    if (savedData === null) {
        return;
    }

    try {
        const data = JSON.parse(savedData);

        if (!Array.isArray(data) || !data.every(book =>
            book !== null &&
            typeof book === 'object' &&
            Array.isArray(book.comments) &&
            typeof book.likes === 'number' &&
            typeof book.liked === 'boolean'
        )) {
            return;
        }

        books = data;

    } catch (error) {
        console.error('Fehler beim Laden der Buchdaten:', error);
    }
}

// Lädt die gespeicherten Daten und rendert anschließend alle Bücher.
function init() {
    getFromLocalStorage();
    renderBooks();
}

// Rendert alle Bücher oder ausschließlich gelikte Bücher, abhängig vom aktiven Filter.
function renderBooks() {
    bookCollRef.innerHTML = '';

    for (let bookIndex = 0; bookIndex < books.length; bookIndex++) {
        const book = books[bookIndex];

        if (showLikedOnly && !book.liked) {
            continue;
        }

        bookCollRef.insertAdjacentHTML('beforeend', getBookTemplate(book, bookIndex));
        renderComments(bookIndex);
    }
}

// Rendert die Kommentare des jeweiligen Buches.
function renderComments(bookIndex) {
    let comments = books[bookIndex].comments;
    let commentsRef = document.getElementById(`comments-list-${bookIndex}`);

    commentsRef.innerHTML = '';

    for (let commentIndex = 0; commentIndex < comments.length; commentIndex++) {
        const comment = comments[commentIndex];

        commentsRef.insertAdjacentHTML('beforeend', getCommentTemplate(comment));
    }
}

// Maskiert HTML-Sonderzeichen, damit Benutzereingaben nicht als HTML-Code ausgeführt werden.
function escapeHtml(value) {
    const element = document.createElement('span');
    element.textContent = String(value);
    return element.innerHTML;
}

// Fügt einen neuen Kommentar zum jeweiligen Buch hinzu und speichert die Änderungen.
function addComment(bookIndex) {
    const username = localStorage.getItem('bookstoreUserName');
    const commentInputRef = document.getElementById(`comment-input-${bookIndex}`);
    const commentText = commentInputRef.value.trim();

    if (!commentText) {
        return;
    }

    if (!username) {
        pendingBookIndex = bookIndex;
        openUsernameDialog();
        return;
    }

    const newComment = {
        name: username,
        comment: commentText
    };

    books[bookIndex].comments.push(newComment);
    saveToLocalStorage();

    renderComments(bookIndex);
    commentInputRef.value = '';
}

// Speichert den Benutzernamen und fügt anschließend den ursprünglichen Kommentar hinzu.
function saveUsername(event) {
    event.preventDefault();

    const username = document.getElementById('username-input').value.trim();

    if (!username) return;

    localStorage.setItem('bookstoreUserName', username);

    const bookIndex = pendingBookIndex;

    closeUsernameDialog();

    if (bookIndex !== null) {
        addComment(bookIndex);
    }
}

// Öffnet den Benutzernamen-Dialog als modales Pop-up.
function openUsernameDialog() {
    usernameDialogRef.showModal();
}

// Schließt den Benutzernamen-Dialog und setzt den gespeicherten Buchindex zurück.
function closeUsernameDialog() {
    usernameDialogRef.close();
    pendingBookIndex = null;
}

// Setzt den Buchindex auch beim Schließen über die Escape-Taste zurück.
usernameDialogRef.addEventListener('close', () => {
    pendingBookIndex = null;
});

// Schließt den Benutzernamen-Dialog bei einem Klick außerhalb des Dialogfensters.
function closeUsernameDialogOutside(event) {
    if (event.target !== usernameDialogRef) {
        return;
    }

    const rect = usernameDialogRef.getBoundingClientRect();

    const isOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

    if (isOutside) {
        closeUsernameDialog();
    }
}

// Ändert den Like-Status eines Buches, aktualisiert den Counter und speichert die Änderungen.
function toggleLike(bookIndex) {
    const book = books[bookIndex];

    const likeCounterRef = document.getElementById(`like-counter-${bookIndex}`);
    const likeButtonRef = document.getElementById(`like-button-${bookIndex}`);

    if (book.liked === false) {
        book.liked = true;
        book.likes++;
    } else {
        book.liked = false;
        book.likes--;
    }

    saveToLocalStorage();

    likeButtonRef.classList.toggle('liked', book.liked);
    likeCounterRef.textContent = book.likes;
    likeButtonRef.setAttribute('aria-pressed', book.liked);

    if (showLikedOnly && !book.liked) {
        renderBooks();
    }
}

// Aktiviert den gewünschten Buchfilter und aktualisiert die angezeigten Buchkarten.
function setBookFilter(likedOnly) {
    showLikedOnly = likedOnly;

    document.getElementById('filter-all')
        .setAttribute('aria-pressed', !likedOnly);

    document.getElementById('filter-liked')
        .setAttribute('aria-pressed', likedOnly);

    renderBooks();
}