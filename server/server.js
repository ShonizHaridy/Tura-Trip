// =============================================
// TURA TRIP BACKEND - COMPLETE SERVER
// Combined app.js and server.js for production
// =============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const { testConnection } = require('./config/database');
const currencyService = require('./services/currencyService');
require('dotenv').config();

// Import routes
const adminRoutes = require('./routes/admin');
const tourRoutes = require('./routes/tours');
const cityRoutes = require('./routes/cities');
const categoryRoutes = require('./routes/categories');
const contentRoutes = require('./routes/content');
const currencyRoutes = require('./routes/currency');
const publicRoutes = require('./routes/public');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE CONFIGURATION
// =============================================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  }
}));

// Compression middleware for better performance
app.use(compression());

// Logging middleware (only in non-test environments)
if (process.env.NODE_ENV !== 'test') {
  const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(logFormat));
}

// Rate limiting - protect against brute force attacks
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs // will be limited on production to 100
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health' || req.path === '/';
  }
});

// Apply rate limiting to all API routes
app.use('/api/', generalLimiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip OPTIONS requests (CORS preflight)
  skip: (req) => {
    return req.method === 'OPTIONS';
  }
});

app.use('/api/admin/login', authLimiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? ['https://turatrip.com', 'https://api.turatrip.com']
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:3000'];
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('/{*any}', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Static files with proper caching
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : '1h',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  }
}));

// Trust proxy (important for production behind reverse proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// =============================================
// API ROUTES
// =============================================

// Admin authentication and profile routes
app.use('/api/admin', adminRoutes);

// Admin management routes (protected)
app.use('/api/admin/tours', tourRoutes);
app.use('/api/admin/cities', cityRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/content', contentRoutes);
app.use('/api/admin/currency', currencyRoutes);

// Public API routes (for frontend)
app.use('/api/public', publicRoutes);

// =============================================
// HEALTH CHECK & ROOT ENDPOINTS
// =============================================

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const { pool } = require('./config/database');
    await pool.execute('SELECT 1');
    
    res.json({ 
      success: true, 
      message: 'Tura Trip API is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      database: 'disconnected',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Tura Trip API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      admin: '/api/admin',
      public: '/api/public',
      documentation: 'https://documenter.getpostman.com/your-collection-id'
    },
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Tura Trip API Documentation',
    version: '1.0.0',
    endpoints: {
      // Admin endpoints
      admin: {
        login: 'POST /api/admin/login',
        profile: 'GET /api/admin/profile',
        dashboard: 'GET /api/admin/dashboard/stats',
        tours: 'CRUD /api/admin/tours',
        cities: 'CRUD /api/admin/cities',
        categories: 'CRUD /api/admin/categories',
        content: 'CRUD /api/admin/content/{faqs,reviews}',
        currency: 'CRUD /api/admin/currency'
      },
      // Public endpoints
      public: {
        homepage: 'GET /api/public/homepage',
        cities: 'GET /api/public/cities/header',
        cityPage: 'GET /api/public/city/:cityName',
        tourDetail: 'GET /api/public/city/:cityName/tour/:tourId',
        search: 'GET /api/public/search',
        faqs: 'GET /api/public/faqs',
        reviews: 'GET /api/public/reviews',
        currency: 'GET /api/public/currency/convert'
      }
    }
  });
});

// =============================================
// ERROR HANDLING MIDDLEWARE
// =============================================

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }
  next(err);
});

// General error handling middleware
app.use((error, req, res, next) => {
  // Log error details
  console.error('Error Details:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Handle specific error types
  
  // Multer file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Too many files or unexpected field name.'
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files uploaded.'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token expired.'
    });
  }

  // Database errors
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry. Resource already exists.'
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referenced resource does not exist.'
    });
  }

  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete resource as it is referenced by other records.'
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors || error.details
    });
  }

  // Syntax errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body.'
    });
  }

  // Connection errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed.'
    });
  }

  // Default server error
  const statusCode = error.statusCode || error.status || 500;
  
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: error.stack,
      type: error.name 
    })
  });
});

// 404 handler - must be last
app.use('/*catchall', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedPath: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/api/health',
      '/api/admin/*',
      '/api/public/*'
    ]
  });
});

// =============================================
// GRACEFUL SHUTDOWN HANDLING
// =============================================

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Close server & exit process in production
  if (process.env.NODE_ENV === 'production') {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// =============================================
// SERVER STARTUP
// =============================================

const startServer = async () => {
  try {
    console.log('🚀 Starting Tura Trip Backend Server...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌍 Node.js Version: ${process.version}`);
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    await testConnection();
    
    // Initialize currency service
    console.log('💱 Starting currency rate updater...');
    currencyService.startCurrencyUpdater();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('✅ SERVER RUNNING SUCCESSFULLY!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📚 Documentation: http://localhost:${PORT}/api`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('🔗 Available Endpoints:');
      console.log('   • Admin Login: POST /api/admin/login');
      console.log('   • Dashboard: GET /api/admin/dashboard/stats');
      console.log('   • Tours: CRUD /api/admin/tours');
      console.log('   • Cities: CRUD /api/admin/cities');
      console.log('   • Categories: CRUD /api/admin/categories');
      console.log('   • Content: CRUD /api/admin/content');
      console.log('   • Currency: CRUD /api/admin/currency');
      console.log('   • Homepage: GET /api/public/homepage');
      console.log('   • City Page: GET /api/public/city/:cityName');
      console.log('   • Tour Detail: GET /api/public/city/:cityName/tour/:tourId');
      console.log('');
      console.log('🔐 Default Admin Credentials:');
      console.log('   Email: admin@turatrip.com');
      console.log('   Password: admin123');
      console.log('');
      console.log('💡 Ready to receive requests!');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Export server for testing
    module.exports = { app, server };
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Please check:');
    console.error('   • Database connection settings in .env');
    console.error('   • Database server is running');
    console.error('   • Required environment variables are set');
    console.error('   • Port is not already in use');
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export app for testing
module.exports = app;