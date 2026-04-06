/**
 * Tournament Controller
 * HTTP request handlers for tournament endpoints
 */

const tournamentService = require('../services/tournamentService');

/**
 * GET /tournaments
 * Get all tournaments
 */
async function getTournaments(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const tournaments = await tournamentService.getAllTournaments(limit, offset);

    res.json({
      success: true,
      data: tournaments,
      pagination: { limit, offset },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tournaments',
      error: err.message,
    });
  }
}

/**
 * GET /tournaments/:id
 * Get tournament with matches
 */
async function getTournamentById(req, res) {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found',
      });
    }

    res.json({
      success: true,
      data: tournament,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tournament',
      error: err.message,
    });
  }
}

/**
 * POST /tournaments
 * Create new tournament (admin only)
 */
async function createTournament(req, res) {
  try {
    const tournament = await tournamentService.createTournament(req.validatedData);

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: tournament,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating tournament',
      error: err.message,
    });
  }
}

/**
 * PATCH /tournaments/:id
 * Update tournament (admin only)
 */
async function updateTournament(req, res) {
  try {
    const tournament = await tournamentService.updateTournament(
      req.params.id,
      req.validatedData
    );

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found',
      });
    }

    res.json({
      success: true,
      message: 'Tournament updated successfully',
      data: tournament,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating tournament',
      error: err.message,
    });
  }
}

/**
 * DELETE /tournaments/:id
 * Delete tournament (admin only)
 */
async function deleteTournament(req, res) {
  try {
    const deleted = await tournamentService.deleteTournament(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found',
      });
    }

    res.json({
      success: true,
      message: 'Tournament deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tournament',
      error: err.message,
    });
  }
}

module.exports = {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
};
