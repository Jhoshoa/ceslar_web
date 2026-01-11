const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const eventRoutes = require('./eventRoutes');
const sermonRoutes = require('./sermonRoutes');
const ministryRoutes = require('./ministryRoutes');
const publicRoutes = require('./publicRoutes');

// API routes
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/sermons', sermonRoutes);
router.use('/ministries', ministryRoutes);
router.use('/public', publicRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
