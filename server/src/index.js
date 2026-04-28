require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Security headers
app.use(helmet());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Personal Finance API is running 🚀' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'personal-finance-api',
    time: new Date(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You have access!',
    user: req.user,
  });
});

// Error middleware (always last)
app.use(errorMiddleware);

// Database check
pool.query('SELECT 1')
  .then(() => console.log('Database connection OK'))
  .catch(err => console.error('Database connection failed', err));

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;