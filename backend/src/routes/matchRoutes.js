/**
 * Match Routes
 */

const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', matchController.getMatches);
router.get('/:id', matchController.getMatchById);

// Admin routes - Create matches with sets
router.post(
  '/',
  verifyToken,
  requireRole(['admin', 'editor']),
  matchController.createMatch
);

module.exports = router;
