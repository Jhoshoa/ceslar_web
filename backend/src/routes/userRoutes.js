const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkJwt, checkRoles } = require('../config/auth0');
const validateRequest = require('../middlewares/validateRequest');
const { userIdValidator, updateUserValidator, listUsersValidator } = require('../validators/userValidator');

// Protected routes (require authentication)
router.use(checkJwt);

// Current user routes
router.get('/me', userController.getMe);
router.put('/me', userController.updateMe);
router.post('/sync', userController.syncUser);

// Member directory (members only)
router.get('/directory', userController.getDirectory);

// Admin routes
router.get('/', checkRoles(['admin', 'staff']), listUsersValidator, validateRequest, userController.listUsers);
router.get('/:id', checkRoles(['admin', 'staff']), userIdValidator, validateRequest, userController.getUserById);
router.put('/:id', checkRoles(['admin']), updateUserValidator, validateRequest, userController.updateUser);
router.delete('/:id', checkRoles(['admin']), userIdValidator, validateRequest, userController.deleteUser);

module.exports = router;
