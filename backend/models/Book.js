// controllers/bookController.js
const Book = require('../models/Book');
const path = require('path');

// GET /api/books - Public: get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/books/upload - Admin: upload new book
const uploadBook = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileUrl = `/uploads/${req.file.filename}`;
    const book = new Book({
      title,
      category,
      date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      year: new Date().getFullYear().toString(),
      fileUrl
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

// DELETE /api/books/:id - Admin: delete a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = {
  getAllBooks,
  uploadBook,
  deleteBook
};