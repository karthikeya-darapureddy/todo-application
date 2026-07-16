require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const authRoutes  = require('./routes/authRoutes');
const taskRoutes  = require('./routes/taskRoutes');
const { errorHandler, notFound } = require('./middleware/error');
const Store       = require('./storage/store');

// ── Initialise data store ────────────────────────────────────────────
Store.init();

const app = express();

// ── Security ─────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ── Rate Limiting ─────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ── CORS ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsers ──────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Static Files (uploads) ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

// ── Health Check ──────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running!', timestamp: new Date().toISOString() });
});

// ── 404 & Error Handlers ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
