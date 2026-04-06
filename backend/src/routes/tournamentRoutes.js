/**
 * Tournament Routes
 */

const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');

// Public routes
router.get('/', tournamentController.getTournaments);
router.get('/:id', tournamentController.getTournamentById);

// Admin routes
router.post(
  '/',
  verifyToken,
  requireRole(['admin', 'editor']),
  validate(schemas.createTournament),
  tournamentController.createTournament
);

router.patch(
  '/:id',
  verifyToken,
  requireRole(['admin', 'editor']),
  validate(schemas.updateTournament),
  tournamentController.updateTournament
);

router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  tournamentController.deleteTournament
);

module.exports = router;
