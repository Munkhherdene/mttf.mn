/**
 * ELO Rating System
 * Implements the ELO rating calculation for table tennis players
 * 
 * Formula:
 * Expected Score (E) = 1 / (1 + 10^((opponent_rating - player_rating) / 400))
 * New Rating = Old Rating + K * (Actual - Expected)
 */

const ELO_K_FACTOR = parseInt(process.env.ELO_K_FACTOR || '32');
const ELO_BASE_RATING = parseInt(process.env.ELO_BASE_RATING || '1000');

/**
 * Calculate expected score for a player
 * @param {number} playerRating - Player's current ELO rating
 * @param {number} opponentRating - Opponent's current ELO rating
 * @returns {number} Expected score (0-1)
 */
function calculateExpectedScore(playerRating, opponentRating) {
  const exponent = (opponentRating - playerRating) / 400;
  const expectedScore = 1 / (1 + Math.pow(10, exponent));
  return expectedScore;
}

/**
 * Calculate new rating after a match
 * @param {number} currentRating - Player's current rating
 * @param {number} opponentRating - Opponent's current rating
 * @param {number} actual - Actual result (1 = win, 0 = loss, 0.5 = draw)
 * @returns {number} New rating
 */
function calculateNewRating(currentRating, opponentRating, actual) {
  const expectedScore = calculateExpectedScore(currentRating, opponentRating);
  const newRating = currentRating + ELO_K_FACTOR * (actual - expectedScore);
  return Math.round(newRating);
}

/**
 * Update ratings after a match
 * @param {number} player1Rating - Player 1's rating
 * @param {number} player2Rating - Player 2's rating
 * @param {number} winnerId - ID of the winning player (1 or 2)
 * @returns {object} New ratings for both players
 */
function updateRatings(player1Rating, player2Rating, winnerId) {
  let player1Actual, player2Actual;

  if (winnerId === 1) {
    player1Actual = 1;
    player2Actual = 0;
  } else if (winnerId === 2) {
    player1Actual = 0;
    player2Actual = 1;
  } else {
    // Draw scenario
    player1Actual = 0.5;
    player2Actual = 0.5;
  }

  const newPlayer1Rating = calculateNewRating(player1Rating, player2Rating, player1Actual);
  const newPlayer2Rating = calculateNewRating(player2Rating, player1Rating, player2Actual);

  return {
    player1Rating: newPlayer1Rating,
    player2Rating: newPlayer2Rating,
    player1RatingChange: newPlayer1Rating - player1Rating,
    player2RatingChange: newPlayer2Rating - player2Rating,
  };
}

module.exports = {
  calculateExpectedScore,
  calculateNewRating,
  updateRatings,
  ELO_K_FACTOR,
  ELO_BASE_RATING,
};
