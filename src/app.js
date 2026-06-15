const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const ApiError = require('./utils/ApiError');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Prevent NoSQL injection attacks by removing keys starting with $ or containing .
const mongoSanitize = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      }
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};

app.use(mongoSanitize);

// Rate limiting for auth endpoints (specifically login)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
    errors: []
  }
});

app.use('/api/auth/login', loginLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Fallback for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this server`));
});

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;
