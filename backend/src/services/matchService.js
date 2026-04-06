/**
 * Match Service
 * Business logic for match operations including ELO updates
 */

const pool = require('../config/database');
const playerService = require('./playerService');

/**
 * Get all matches with optional filtering
 */
async function getAllMatches(tournamentId = null, limit = 50, offset = 0) {
  let query = `
    SELECT m.id, m.tournament_id, m.player1_id, m.player2_id, m.winner_id,
           m.player1_set_wins, m.player2_set_wins, m.total_sets,
           m.played_at, m.created_at, m.updated_at,
           p1.name as player1_name, p1.rating as player1_rating,
           p2.name as player2_name, p2.rating as player2_rating,
           pw.name as winner_name,
           t.name as tournament_name
    FROM matches m
    JOIN players p1 ON m.player1_id = p1.id
    JOIN players p2 ON m.player2_id = p2.id
    LEFT JOIN players pw ON m.winner_id = pw.id
    JOIN tournaments t ON m.tournament_id = t.id
  `;

  const params = [];

  if (tournamentId) {
    query += `WHERE m.tournament_id = $1 `;
    params.push(tournamentId);
  }

  query += `ORDER BY m.played_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
}

/**
 * Get match by ID with detailed set information
 */
async function getMatchById(matchId) {
  const matchQuery = `
    SELECT m.id, m.tournament_id, m.player1_id, m.player2_id, m.winner_id,
           m.player1_set_wins, m.player2_set_wins, m.total_sets,
           m.played_at, m.created_at, m.updated_at,
           p1.name as player1_name, p1.rating as player1_rating,
           p2.name as player2_name, p2.rating as player2_rating,
           pw.name as winner_name,
           t.name as tournament_name
    FROM matches m
    JOIN players p1 ON m.player1_id = p1.id
    JOIN players p2 ON m.player2_id = p2.id
    LEFT JOIN players pw ON m.winner_id = pw.id
    JOIN tournaments t ON m.tournament_id = t.id
    WHERE m.id = $1
  `;

  const matchResult = await pool.query(matchQuery, [matchId]);

  if (matchResult.rows.length === 0) {
    return null;
  }

  const match = matchResult.rows[0];

  // Get sets
  const setsQuery = `
    SELECT set_number, player1_score, player2_score
    FROM match_sets
    WHERE match_id = $1
    ORDER BY set_number
  `;

  const setsResult = await pool.query(setsQuery, [matchId]);
  match.sets = setsResult.rows;

  return match;
}

/**
 * Create new match with sets (transaction)
 */
async function createMatch(matchData, sets) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create match
    const matchQuery = `
      INSERT INTO matches 
      (tournament_id, player1_id, player2_id, winner_id, total_sets, played_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, tournament_id, player1_id, player2_id, winner_id, 
                player1_set_wins, player2_set_wins, total_sets, played_at
    `;

    const matchResult = await client.query(matchQuery, [
      matchData.tournament_id,
      matchData.player1_id,
      matchData.player2_id,
      matchData.winner_id,
      sets.length,
      matchData.played_at,
    ]);

    const match = matchResult.rows[0];

    // Count set wins
    let player1SetWins = 0;
    let player2SetWins = 0;

    // Insert sets
    const setInsertQuery = `
      INSERT INTO match_sets (match_id, set_number, player1_score, player2_score)
      VALUES ($1, $2, $3, $4)
    `;

    for (const set of sets) {
      await client.query(setInsertQuery, [
        match.id,
        set.set_number,
        set.player1_score,
        set.player2_score,
      ]);

      if (set.player1_score > set.player2_score) {
        player1SetWins++;
      } else {
        player2SetWins++;
      }
    }

    // Update match set wins
    const updateMatchQuery = `
      UPDATE matches
      SET player1_set_wins = $1, player2_set_wins = $2
      WHERE id = $3
    `;
    await client.query(updateMatchQuery, [player1SetWins, player2SetWins, match.id]);

    // Update player ratings
    const won = matchData.winner_id === matchData.player1_id;
    await playerService.updatePlayerRating(matchData.player1_id, matchData.player2_id, won);

    await client.query('COMMIT');

    return match;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get head-to-head record between two players
 */
async function getHeadToHead(player1Id, player2Id) {
  const query = `
    SELECT 
      COUNT(*) as total_matches,
      SUM(CASE WHEN winner_id = $1 THEN 1 ELSE 0 END) as player1_wins,
      SUM(CASE WHEN winner_id = $2 THEN 1 ELSE 0 END) as player2_wins
    FROM matches
    WHERE (player1_id = $1 AND player2_id = $2)
       OR (player1_id = $2 AND player2_id = $1)
  `;

  const result = await pool.query(query, [player1Id, player2Id]);
  return result.rows[0];
}

/**
 * Get recent matches for a player
 */
async function getPlayerMatches(playerId, limit = 10) {
  const query = `
    SELECT m.id, m.tournament_id, m.player1_id, m.player2_id, m.winner_id,
           m.player1_set_wins, m.player2_set_wins, m.total_sets,
           m.played_at,
           CASE WHEN m.player1_id = $1 THEN p2.name ELSE p1.name END as opponent_name,
           CASE WHEN m.player1_id = $1 THEN p2.id ELSE p1.id END as opponent_id,
           CASE WHEN m.winner_id = $1 THEN true ELSE false END as won,
           t.name as tournament_name
    FROM matches m
    JOIN players p1 ON m.player1_id = p1.id
    JOIN players p2 ON m.player2_id = p2.id
    JOIN tournaments t ON m.tournament_id = t.id
    WHERE m.player1_id = $1 OR m.player2_id = $1
    ORDER BY m.played_at DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [playerId, limit]);
  return result.rows;
}

/**
 * Get player performance by tournament
 */
async function getPlayerTournamentStats(playerId) {
  const query = `
    SELECT 
      t.id, t.name, t.type,
      COUNT(*) as total_matches,
      SUM(CASE WHEN m.winner_id = $1 THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN m.winner_id != $1 AND m.winner_id IS NOT NULL THEN 1 ELSE 0 END) as losses
    FROM matches m
    JOIN tournaments t ON m.tournament_id = t.id
    WHERE m.player1_id = $1 OR m.player2_id = $1
    GROUP BY t.id, t.name, t.type
    ORDER BY t.start_date DESC
  `;

  const result = await pool.query(query, [playerId]);
  return result.rows;
}

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  getHeadToHead,
  getPlayerMatches,
  getPlayerTournamentStats,
};
