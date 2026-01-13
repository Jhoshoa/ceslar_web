const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const eventRoutes = require('./eventRoutes');
const sermonRoutes = require('./sermonRoutes');
const ministryRoutes = require('./ministryRoutes');
const publicRoutes = require('./publicRoutes');
const churchRoutes = require('./churchRoutes');
const membershipRoutes = require('./membershipRoutes');
const questionRoutes = require('./questionRoutes');

// API routes
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/sermons', sermonRoutes);
router.use('/ministries', ministryRoutes);
router.use('/public', publicRoutes);
router.use('/churches', churchRoutes);
router.use('/memberships', membershipRoutes);
router.use('/questions', questionRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
