const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
// Security headers
app.use(helmet());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

app.use(limiter);

// Body size limit
app.use(express.json({ limit: '10kb' }));

app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Personal Finance API is running 🚀' });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "personal-finance-api",
    time: new Date()
  });
});

const PORT = process.env.PORT || 5000;

const pool = require('./config/db');

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL ✅');
  })
  .catch((err) => {
    console.error('PostgreSQL connection error ❌', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

const authMiddleware = require('./middleware/authMiddleware');

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You have access!',
    user: req.user,
  });
});

const transactionRoutes = require('./routes/transactionRoutes');

app.use('/api/transactions', transactionRoutes);

const errorMiddleware = require('./middleware/errorMiddleware');

app.use(errorMiddleware);