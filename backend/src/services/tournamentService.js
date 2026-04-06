/**
 * Tournament Service
 * Business logic for tournament operations
 */

const pool = require('../config/database');

/**
 * Get all tournaments
 */
async function getAllTournaments(limit = 50, offset = 0) {
  const query = `
    SELECT id, name, start_date, end_date, location, type, description, created_at, updated_at
    FROM tournaments
    ORDER BY start_date DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

/**
 * Get tournament by ID with matches
 */
async function getTournamentById(tournamentId) {
  const tournamentQuery = `
    SELECT id, name, start_date, end_date, location, type, description, created_at, updated_at
    FROM tournaments
    WHERE id = $1
  `;

  const tournamentResult = await pool.query(tournamentQuery, [tournamentId]);

  if (tournamentResult.rows.length === 0) {
    return null;
  }

  const tournament = tournamentResult.rows[0];

  // Get matches for this tournament
  const matchesQuery = `
    SELECT m.id, m.player1_id, m.player2_id, m.winner_id, 
           m.player1_set_wins, m.player2_set_wins, m.total_sets,
           m.played_at, p1.name as player1_name, p2.name as player2_name,
           pw.name as winner_name
    FROM matches m
    JOIN players p1 ON m.player1_id = p1.id
    JOIN players p2 ON m.player2_id = p2.id
    LEFT JOIN players pw ON m.winner_id = pw.id
    WHERE m.tournament_id = $1
    ORDER BY m.played_at DESC
  `;

  const matchesResult = await pool.query(matchesQuery, [tournamentId]);
  tournament.matches = matchesResult.rows;

  return tournament;
}

/**
 * Create new tournament
 */
async function createTournament(tournamentData) {
  const query = `
    INSERT INTO tournaments (name, start_date, end_date, location, type, description)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, start_date, end_date, location, type, description, created_at, updated_at
  `;

  const result = await pool.query(query, [
    tournamentData.name,
    tournamentData.start_date,
    tournamentData.end_date,
    tournamentData.location || null,
    tournamentData.type,
    tournamentData.description || null,
  ]);

  return result.rows[0];
}

/**
 * Update tournament
 */
async function updateTournament(tournamentId, tournamentData) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (tournamentData.name) {
    fields.push(`name = $${paramCount++}`);
    values.push(tournamentData.name);
  }
  if (tournamentData.start_date) {
    fields.push(`start_date = $${paramCount++}`);
    values.push(tournamentData.start_date);
  }
  if (tournamentData.end_date) {
    fields.push(`end_date = $${paramCount++}`);
    values.push(tournamentData.end_date);
  }
  if (tournamentData.location !== undefined) {
    fields.push(`location = $${paramCount++}`);
    values.push(tournamentData.location);
  }
  if (tournamentData.type) {
    fields.push(`type = $${paramCount++}`);
    values.push(tournamentData.type);
  }
  if (tournamentData.description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(tournamentData.description);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(tournamentId);

  if (fields.length === 1) return null;

  const query = `
    UPDATE tournaments
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, name, start_date, end_date, location, type, description, created_at, updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Delete tournament
 */
async function deleteTournament(tournamentId) {
  const query = 'DELETE FROM tournaments WHERE id = $1 RETURNING id';
  const result = await pool.query(query, [tournamentId]);
  return result.rows.length > 0;
}

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
};
