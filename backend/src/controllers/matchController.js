/**
 * Match Controller
 * HTTP request handlers for match endpoints
 */

const matchService = require('../services/matchService');

/**
 * GET /matches
 * Get all matches with optional tournament filter
 */
async function getMatches(req, res) {
  try {
    const tournamentId = req.query.tournament_id ? parseInt(req.query.tournament_id) : null;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const matches = await matchService.getAllMatches(tournamentId, limit, offset);

    res.json({
      success: true,
      data: matches,
      pagination: { limit, offset },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching matches',
      error: err.message,
    });
  }
}

/**
 * GET /matches/:id
 * Get match with sets
 */
async function getMatchById(req, res) {
  try {
    const match = await matchService.getMatchById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }

    res.json({
      success: true,
      data: match,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching match',
      error: err.message,
    });
  }
}

/**
 * POST /matches
 * Create new match with sets (admin only)
 */
async function createMatch(req, res) {
  try {
    const { sets, ...matchData } = req.body;

    if (!sets || !Array.isArray(sets) || sets.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Match must have at least one set',
      });
    }

    const match = await matchService.createMatch(matchData, sets);

    res.status(201).json({
      success: true,
      message: 'Match created successfully and ratings updated',
      data: match,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating match',
      error: err.message,
    });
  }
}

/**
 * GET /players/:id/head-to-head/:opponentId
 * Get head-to-head record between two players
 */
async function getHeadToHead(req, res) {
  try {
    const h2h = await matchService.getHeadToHead(req.params.id, req.params.opponentId);

    res.json({
      success: true,
      data: h2h,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching head-to-head',
      error: err.message,
    });
  }
}

/**
 * GET /players/:id/matches
 * Get player's recent matches
 */
async function getPlayerMatches(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const matches = await matchService.getPlayerMatches(req.params.id, limit);

    res.json({
      success: true,
      data: matches,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching player matches',
      error: err.message,
    });
  }
}

/**
 * GET /players/:id/tournament-stats
 * Get player's performance by tournament
 */
async function getPlayerTournamentStats(req, res) {
  try {
    const stats = await matchService.getPlayerTournamentStats(req.params.id);

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tournament stats',
      error: err.message,
    });
  }
}

module.exports = {
  getMatches,
  getMatchById,
  createMatch,
  getHeadToHead,
  getPlayerMatches,
  getPlayerTournamentStats,
};
