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


function getCommentTemplate(comment) {
    return `<p>
                <strong>${escapeHtml(comment.name)}:</strong>
                ${escapeHtml(comment.comment)}
            </p>`
}
