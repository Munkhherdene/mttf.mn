/**
 * Player Service
 * Business logic for player operations
 */

const pool = require('../config/database');
const { updateRatings } = require('../utils/eloRating');

/**
 * Get all players with optional filtering and pagination
 */
async function getAllPlayers(limit = 50, offset = 0, sortBy = 'rating') {
  const query = `
    SELECT id, name, age, club, nationality, rating, peak_rating, 
           total_matches, wins, losses, created_at, updated_at
    FROM players
    ORDER BY ${sortBy === 'name' ? 'name' : 'rating'} ${sortBy === 'name' ? 'ASC' : 'DESC'}
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

/**
 * Get player by ID with detailed statistics
 */
async function getPlayerById(playerId) {
  const playerQuery = `
    SELECT id, name, age, club, nationality, rating, peak_rating,
           total_matches, wins, losses, created_at, updated_at
    FROM players
    WHERE id = $1
  `;

  const playerResult = await pool.query(playerQuery, [playerId]);

  if (playerResult.rows.length === 0) {
    return null;
  }

  const player = playerResult.rows[0];

  // Get player stats
  const statsQuery = `
    SELECT win_rate, last_10_wins, last_10_matches, head_to_head_json
    FROM player_stats
    WHERE player_id = $1
  `;

  const statsResult = await pool.query(statsQuery, [playerId]);
  if (statsResult.rows.length > 0) {
    player.stats = statsResult.rows[0];
    if (player.stats.head_to_head_json) {
      player.stats.headToHead = JSON.parse(player.stats.head_to_head_json);
    }
  }

  return player;
}

/**
 * Create new player
 */
async function createPlayer(playerData) {
  const query = `
    INSERT INTO players (name, age, club, nationality, rating, peak_rating)
    VALUES ($1, $2, $3, $4, $5, $5)
    RETURNING id, name, age, club, nationality, rating, peak_rating, 
              total_matches, wins, losses, created_at, updated_at
  `;

  const baseRating = parseInt(process.env.ELO_BASE_RATING || '1000');
  const result = await pool.query(query, [
    playerData.name,
    playerData.age || null,
    playerData.club || null,
    playerData.nationality || 'Mongolia',
    baseRating,
  ]);

  const newPlayer = result.rows[0];

  // Create player stats entry
  const statsQuery = `
    INSERT INTO player_stats (player_id, win_rate, last_10_wins, last_10_matches)
    VALUES ($1, 0.00, 0, 0)
  `;
  await pool.query(statsQuery, [newPlayer.id]);

  return newPlayer;
}

/**
 * Update player info (name, club, etc.)
 */
async function updatePlayer(playerId, playerData) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (playerData.name) {
    fields.push(`name = $${paramCount++}`);
    values.push(playerData.name);
  }
  if (playerData.age !== undefined) {
    fields.push(`age = $${paramCount++}`);
    values.push(playerData.age);
  }
  if (playerData.club !== undefined) {
    fields.push(`club = $${paramCount++}`);
    values.push(playerData.club);
  }
  if (playerData.nationality) {
    fields.push(`nationality = $${paramCount++}`);
    values.push(playerData.nationality);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(playerId);

  if (fields.length === 1) return null; // No fields to update

  const query = `
    UPDATE players
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, name, age, club, nationality, rating, peak_rating, 
              total_matches, wins, losses, created_at, updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Delete player
 */
async function deletePlayer(playerId) {
  const query = 'DELETE FROM players WHERE id = $1 RETURNING id';
  const result = await pool.query(query, [playerId]);
  return result.rows.length > 0;
}

/**
 * Update player rating after a match
 */
async function updatePlayerRating(playerId, opponentId, won) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get both players' current ratings
    const playersQuery = `SELECT id, rating FROM players WHERE id IN ($1, $2)`;
    const playersResult = await client.query(playersQuery, [playerId, opponentId]);

    const players = playersResult.rows;
    const player = players.find((p) => p.id === playerId);
    const opponent = players.find((p) => p.id === opponentId);

    if (!player || !opponent) {
      throw new Error('Player not found');
    }

    // Calculate new ratings
    const winnerId = won ? 1 : 2;
    const newRatings = updateRatings(player.rating, opponent.rating, winnerId);

    // Update ratings
    const updateQuery = `
      UPDATE players
      SET rating = $1, peak_rating = CASE WHEN peak_rating > $1 THEN peak_rating ELSE $1 END, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    await client.query(updateQuery, [newRatings.player1Rating, playerId]);
    await client.query(updateQuery, [newRatings.player2Rating, opponentId]);

    // Update wins/losses
    const winLossQuery = `
      UPDATE players
      SET total_matches = total_matches + 1,
          wins = wins + $1,
          losses = losses + $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `;
    await client.query(winLossQuery, [won ? 1 : 0, won ? 0 : 1, playerId]);
    await client.query(winLossQuery, [won ? 0 : 1, won ? 1 : 0, opponentId]);

    // Insert ranking history
    const rankingQuery = `
      INSERT INTO rankings (player_id, rating, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP), ($3, $4, CURRENT_TIMESTAMP)
    `;
    await client.query(rankingQuery, [
      playerId,
      newRatings.player1Rating,
      opponentId,
      newRatings.player2Rating,
    ]);

    await client.query('COMMIT');

    return {
      playerId,
      newRating: newRatings.player1Rating,
      ratingChange: newRatings.player1RatingChange,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get player rankings
 */
async function getPlayerRankings(limit = 50, offset = 0) {
  const query = `
    SELECT p.id, p.name, p.rating, p.peak_rating, p.total_matches, p.wins, p.losses,
           p.club, p.nationality,
           CASE WHEN p.total_matches > 0 
                THEN ROUND((CAST(p.wins AS FLOAT) / p.total_matches) * 100, 2)
                ELSE 0 
           END as win_rate
    FROM players p
    ORDER BY p.rating DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  updatePlayerRating,
  getPlayerRankings,
};
