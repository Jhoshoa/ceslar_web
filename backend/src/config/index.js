require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiVersion: process.env.API_VERSION || 'v1',

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/church_db',
    uriTest: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/church_db_test',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'noreply@church.com',
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    path: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    file: process.env.LOG_FILE || './logs/app.log',
  },
};
