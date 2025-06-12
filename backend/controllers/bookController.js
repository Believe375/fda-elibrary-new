const Book = require("../models/book");
const path = require("path");
const fs = require("fs");

// @desc    Upload a new book (admin only)
exports.uploadBook = async (req, res) => {
  try {
    const { title, category, year } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const newBook = new Book({
      title,
      category,
      year,
      filePath: file.filename,
    });

    await newBook.save();
    res.status(201).json({ message: "Book uploaded successfully.", book: newBook });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error during upload." });
  }
};

// @desc    Get all books (public)
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books." });
  }
};

// @desc    Delete a book by ID (admin only)
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Remove the uploaded file from filesystem
    const filePath = path.join(__dirname, "../uploads", book.filePath);
    fs.unlink(filePath, (err) => {
      if (err) console.warn("File deletion warning:", err.message);
    });

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete book." });
  }
};