/**
 * Player Controller
 * HTTP request handlers for player endpoints
 */

const playerService = require('../services/playerService');

/**
 * GET /players
 * Get all players with pagination
 */
async function getPlayers(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const sortBy = req.query.sortBy || 'rating';

    const players = await playerService.getAllPlayers(limit, offset, sortBy);

    res.json({
      success: true,
      data: players,
      pagination: { limit, offset },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching players',
      error: err.message,
    });
  }
}

/**
 * GET /players/:id
 * Get player by ID with stats
 */
async function getPlayerById(req, res) {
  try {
    const player = await playerService.getPlayerById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found',
      });
    }

    res.json({
      success: true,
      data: player,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching player',
      error: err.message,
    });
  }
}

/**
 * POST /players
 * Create new player (admin only)
 */
async function createPlayer(req, res) {
  try {
    const player = await playerService.createPlayer(req.validatedData);

    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      data: player,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating player',
      error: err.message,
    });
  }
}

/**
 * PATCH /players/:id
 * Update player (admin only)
 */
async function updatePlayer(req, res) {
  try {
    const player = await playerService.updatePlayer(req.params.id, req.validatedData);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found or no fields to update',
      });
    }

    res.json({
      success: true,
      message: 'Player updated successfully',
      data: player,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating player',
      error: err.message,
    });
  }
}

/**
 * DELETE /players/:id
 * Delete player (admin only)
 */
async function deletePlayer(req, res) {
  try {
    const deleted = await playerService.deletePlayer(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Player not found',
      });
    }

    res.json({
      success: true,
      message: 'Player deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting player',
      error: err.message,
    });
  }
}

/**
 * GET /rankings
 * Get player rankings
 */
async function getRankings(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const rankings = await playerService.getPlayerRankings(limit, offset);

    res.json({
      success: true,
      data: rankings,
      pagination: { limit, offset },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rankings',
      error: err.message,
    });
  }
}

module.exports = {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getRankings,
};
