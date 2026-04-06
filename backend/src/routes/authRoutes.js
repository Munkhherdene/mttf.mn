/**
 * Auth Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');

router.post('/register', validate(schemas.register), authController.register);

router.post('/login', validate(schemas.login), authController.login);

router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;
