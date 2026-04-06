/**
 * Player Routes
 */

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const matchController = require('../controllers/matchController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');

// Public routes
router.get('/', playerController.getPlayers);
router.get('/rankings', playerController.getRankings);
router.get('/:id', playerController.getPlayerById);
router.get('/:id/matches', matchController.getPlayerMatches);
router.get('/:id/tournament-stats', matchController.getPlayerTournamentStats);
router.get('/:id/head-to-head/:opponentId', matchController.getHeadToHead);

// Admin routes
router.post(
  '/',
  verifyToken,
  requireRole(['admin', 'editor']),
  validate(schemas.createPlayer),
  playerController.createPlayer
);

router.patch(
  '/:id',
  verifyToken,
  requireRole(['admin', 'editor']),
  validate(schemas.updatePlayer),
  playerController.updatePlayer
);

router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  playerController.deletePlayer
);

module.exports = router;
