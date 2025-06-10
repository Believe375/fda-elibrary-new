const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Init app
const app = express();
dotenv.config();

// Connect to DB
connectDB();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

// Static files
const frontendPath = path.join(__dirname, '../frontend');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(frontendPath));

// API Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Fallback to index.html for unmatched frontend routes (for SPA compatibility)
app.get('*', (req, res) => {
  const requestedPath = req.path;
  if (
    requestedPath.endsWith('.html') ||
    requestedPath.startsWith('/api') ||
    requestedPath.startsWith('/uploads')
  ) {
    res.status(404).send('Not found');
  } else {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});