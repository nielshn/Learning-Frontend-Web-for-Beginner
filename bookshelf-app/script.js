document.addEventListener("DOMContentLoaded", function () {
    const incompleteBookshelf = document.getElementById("incompleteBookshelf");
    const completeBookshelf = document.getElementById("completeBookshelf");
    const searchInput = document.getElementById("searchBookTitle");
    const inputBookForm = document.getElementById("inputBookForm");
    const editBookForm = document.getElementById("editBookForm");
    const deleteConfirmation = document.getElementById("deleteConfirmation");
    const deleteTitle = document.getElementById("deleteTitle");
    const confirmDeleteButton = document.getElementById("confirmDelete");
    const cancelDeleteButton = document.getElementById("cancelDelete");
    const editButton = document.getElementById("editButton");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    function renderBooks(filteredBooks) {
        incompleteBookshelf.innerHTML = "";
        completeBookshelf.innerHTML = "";

        const booksToRender = filteredBooks ? filteredBooks : books;

        booksToRender.forEach((book) => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book");
            bookElement.innerHTML = `
              <h4>${book.title}</h4><br>
              <p>Author: ${book.author}</p><br>
              <p>Year: ${book.year}</p><br>
              <button class="moveButton">${book.isComplete ? "Move to Unread" : "Move to Read"}</button>
              <button class="editButton" data-book-id="${book.id}"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="deleteButton"><i class="fa-solid fa-trash"></i></button>
          `;

            const moveButton = bookElement.querySelector(".moveButton");
            moveButton.addEventListener("click", () => moveBook(book.id));

            const editButton = bookElement.querySelector(".editButton");
            editButton.addEventListener("click", () => showEditForm(book));

            const deleteButton = bookElement.querySelector(".deleteButton");
            deleteButton.addEventListener("click", () => showDeleteConfirmation(book.id, book.title));

            if (book.isComplete) {
                completeBookshelf.appendChild(bookElement);
            } else {
                incompleteBookshelf.appendChild(bookElement);
            }
        });
    }

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm) || book.year.toString().includes(searchTerm));
        renderBooks(filteredBooks);
    });

    function addBook(event) {
        event.preventDefault();

        const id = +new Date();
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = +document.getElementById("inputBookYear").value;
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        const newBook = {id, title, author, year, isComplete};
        books.push(newBook);
        localStorage.setItem("books", JSON.stringify(books));

        renderBooks();
        inputBookForm.reset();
    }

    function moveBook(id) {
        const index = books.findIndex((book) => book.id === id);
        books[index].isComplete = !books[index].isComplete;
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
    }

    function showEditForm(book) {
        editBookForm.dataset.bookId = book.id;
        document.getElementById("editBookTitle").value = book.title;
        document.getElementById("editBookAuthor").value = book.author;
        document.getElementById("editBookYear").value = book.year;
        document.getElementById("editBookIsComplete").checked = book.isComplete;
        editBookForm.style.display = "block";
    }

    function editBook() {
        const bookId = editBookForm.dataset.bookId;
        const index = books.findIndex((book) => book.id === parseInt(bookId));
        if (index !== -1) {
            books[index].title = document.getElementById("editBookTitle").value;
            books[index].author = document.getElementById("editBookAuthor").value;
            books[index].year = parseInt(document.getElementById("editBookYear").value);
            books[index].isComplete = document.getElementById("editBookIsComplete").checked;
            localStorage.setItem("books", JSON.stringify(books));
            renderBooks();
            editBookForm.style.display = "none";
        }
    }

    function showDeleteConfirmation(id, title) {
        deleteTitle.textContent = title;
        deleteConfirmation.style.display = "block";
        confirmDeleteButton.addEventListener("click", () => deleteBook(id));
        cancelDeleteButton.addEventListener("click", () => (deleteConfirmation.style.display = "none"));
    }

    function deleteBook(id) {
        books = books.filter((book) => book.id !== id);
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
        deleteConfirmation.style.display = "none";
    }

    inputBookForm.addEventListener("submit", addBook);

    editButton.addEventListener("click", () => {
        editBook();
        editBookForm.style.display = "none";
    });

    renderBooks();
});
