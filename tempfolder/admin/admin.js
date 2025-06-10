document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const bookForm = document.getElementById("bookForm");
  const bookList = document.getElementById("bookList");
  const backendURL = "https://fda-library-backend.onrender.com";

  // Check if user is logged in and is an admin
  netlifyIdentity.on("init", user => {
    if (!user || user.app_metadata.role !== "admin") {
      alert("Access denied. Admins only.");
      window.location.href = "/";
    } else {
      loadBooks();
    }
  });

  netlifyIdentity.on("login", user => {
    if (user.app_metadata.role === "admin") {
      loadBooks();
    } else {
      alert("Access denied. Admins only.");
      netlifyIdentity.logout();
      window.location.href = "/";
    }
  });

  logoutBtn.addEventListener("click", () => {
    netlifyIdentity.logout();
    window.location.href = "/";
  });

  // Load books
  async function loadBooks() {
    bookList.innerHTML = "<p>Loading books...</p>";
    try {
      const res = await fetch(`${backendURL}/api/books`);
      const books = await res.json();

      if (!Array.isArray(books) || books.length === 0) {
        bookList.innerHTML = "<p>No books found.</p>";
        return;
      }

      bookList.innerHTML = "";
      books.forEach(book => {
        const item = document.createElement("div");
        item.className = "book-item";
        item.innerHTML = `
          <div class="details">
            <h3>${book.title}</h3>
            <p>Category: ${book.category} | Year: ${book.year}</p>
            <p><a href="${book.viewUrl}" target="_blank">View</a> | <a href="${book.downloadUrl}" target="_blank">Download</a></p>
          </div>
          <button class="delete-btn" data-id="${book._id}">Delete</button>
        `;
        bookList.appendChild(item);
      });
    } catch (err) {
      console.error(err);
      bookList.innerHTML = "<p>Error loading books.</p>";
    }
  }

  // Book upload
  bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = bookForm.title.value.trim();
    const category = bookForm.category.value.trim();
    const year = bookForm.year.value.trim();
    const file = bookForm.file.files[0];

    if (!title || !category || !year || !file) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("year", year);
    formData.append("file", file);

    try {
      const user = netlifyIdentity.currentUser();
      const token = await user.jwt();

      const res = await fetch(`${backendURL}/api/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Book uploaded successfully.");
        bookForm.reset();
        loadBooks();
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload book.");
    }
  });

  // Delete book
  bookList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      if (!confirm("Are you sure you want to delete this book?")) return;

      try {
        const user = netlifyIdentity.currentUser();
        const token = await user.jwt();

        const res = await fetch(`${backendURL}/api/books/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          alert("Book deleted successfully.");
          loadBooks();
        } else {
          const err = await res.json();
          throw new Error(err.message);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete book.");
      }
    }
  });
});