class Author {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

class Book {
    constructor(name, price, author) {
        this.name = name;
        this.price = price;
        this.author = author;
    }
}

let books = JSON.parse(localStorage.getItem("books")) || [];
let bookCount = 0;

function startAddingBooks() {
    bookCount = parseInt(document.getElementById("bookCount").value);
    if (isNaN(bookCount) || bookCount < 1) {
        alert("Please enter a valid number.");
        return;
    }
    document.getElementById("startSection").style.display = "none";
    document.getElementById("formSection").style.display = "block";
}

function addBook(name, price, authorName, authorEmail) {
    if (books.some(book => book.name.toLowerCase() === name.toLowerCase())) {
        alert("Book with this name already exists!");
        return;
    }

    if (price <= 0) {
        alert("Price must be a positive number!");
        return;
    }

    const author = new Author(authorName, authorEmail);
    const book = new Book(name, price, author);
    books.push(book);
    saveToLocalStorage();
    displayBooks();
}

function displayBooks() {
    const tableBody = document.querySelector("#bookTable tbody");
    tableBody.innerHTML = ""; 

    books.forEach((book, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.name}</td>
            <td>${book.price}</td>
            <td>${book.author.name}</td>
            <td>${book.author.email}</td>
            <td>
                <button onclick="editBook(${index})">Edit</button>
                <button onclick="deleteBook(${index})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function editBook(index) {
    const book = books[index];
    const row = document.querySelector(`#bookTable tbody tr:nth-child(${index + 1})`);
    row.classList.add("editing");

    row.innerHTML = `
        <td><input type="text" value="${book.name}" id="editName"></td>
        <td><input type="number" value="${book.price}" id="editPrice"></td>
        <td><input type="text" value="${book.author.name}" id="editAuthorName"></td>
        <td><input type="email" value="${book.author.email}" id="editAuthorEmail"></td>
        <td>
            <button onclick="saveChanges(${index})">Save</button>
            <button onclick="cancelEdit()">Cancel</button>
        </td>
    `;
}

function saveChanges(index) {
    const name = document.getElementById("editName").value;
    const price = document.getElementById("editPrice").value;
    const authorName = document.getElementById("editAuthorName").value;
    const authorEmail = document.getElementById("editAuthorEmail").value;

    if (!name || !price || !authorName || !authorEmail) {
        alert("Please fill all fields.");
        return;
    }

    books[index] = new Book(name, price, new Author(authorName, authorEmail));
    saveToLocalStorage();
    displayBooks();
}

function cancelEdit() {
    displayBooks();
}

function deleteBook(index) {
    if (confirm("Are you sure you want to delete this book?")) {
        books.splice(index, 1);
        saveToLocalStorage();
        displayBooks();
    }
}

function saveToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
}

document.addEventListener("DOMContentLoaded", displayBooks);

document.getElementById("bookForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const bookName = document.getElementById("bookName").value;
    const bookPrice = document.getElementById("bookPrice").value;
    const authorName = document.getElementById("authorName").value;
    const authorEmail = document.getElementById("authorEmail").value;

    addBook(bookName, bookPrice, authorName, authorEmail);
    document.getElementById("bookForm").reset();
});
