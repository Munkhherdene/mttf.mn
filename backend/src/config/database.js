/**
 * Database Connection Module
 * Mock in-memory database for demo/development without PostgreSQL
 */

require('dotenv').config();

// Mock in-memory database
const db = {
  users: [
    { id: 1, email: 'admin@mttf.mn', password_hash: '$2a$10$9arIBl5SG.ZrpUlsUkO2jeZmGwhCcZSF.9aQPfKsLPRtDwVtqMfWW', name: 'Admin', role: 'admin' },
    { id: 2, email: 'editor@mttf.mn', password_hash: '$2a$10$9arIBl5SG.ZrpUlsUkO2jeZmGwhCcZSF.9aQPfKsLPRtDwVtqMfWW', name: 'Editor', role: 'editor' }
  ],
  players: [
    { id: 1, name: 'Тэнгис Батүмөр', rating: 1200, club: 'UB Club', wins: 45, losses: 15, total_matches: 60 },
    { id: 2, name: 'Баярмаа Болд', rating: 1150, club: 'UB Club', wins: 40, losses: 18, total_matches: 58 },
    { id: 3, name: 'Өнөө Баатар', rating: 1100, club: 'Darkhan Club', wins: 35, losses: 20, total_matches: 55 },
    { id: 4, name: 'Батжав Сүхээ', rating: 1050, club: 'UB Club', wins: 30, losses: 25, total_matches: 55 },
    { id: 5, name: 'Мөнхзул Ганзоо', rating: 1000, club: 'Darkhan Club', wins: 25, losses: 25, total_matches: 50 }
  ],
  tournaments: [
    { id: 1, name: 'National Championship', type: 'National', start_date: '2026-04-01', end_date: '2026-04-05' },
    { id: 2, name: 'Spring Open', type: 'International', start_date: '2026-03-15', end_date: '2026-03-20' }
  ],
  matches: [
    { id: 1, tournament_id: 1, player1_id: 1, player2_id: 2, winner_id: 1 },
    { id: 2, tournament_id: 1, player1_id: 3, player2_id: 4, winner_id: 3 },
    { id: 3, tournament_id: 2, player1_id: 1, player2_id: 3, winner_id: 1 }
  ],
  news: [
    { id: 1, title: 'National Championship Results', content: 'Тэнгис won the championship...', published: true },
    { id: 2, title: 'New Player Registration', content: 'We welcome new players...', published: true }
  ]
};

// Track next IDs
let nextPlayerId = Math.max(...db.players.map(p => p.id), 0) + 1;
let nextTournamentId = Math.max(...db.tournaments.map(t => t.id), 0) + 1;
let nextMatchId = Math.max(...db.matches.map(m => m.id), 0) + 1;
let nextNewsId = Math.max(...db.news.map(n => n.id), 0) + 1;

// Mock query function
const pool = {
  query: async (sql, params) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 50));
    
    // ===== SELECT QUERIES =====
    if (sql.includes('SELECT')) {
      // Players
      if (sql.includes('FROM players')) {
        let results = [...db.players];
        
        // WHERE clause for specific ID
        if (sql.includes('WHERE id = $1') && params[0]) {
          results = results.filter(p => p.id === parseInt(params[0]));
        }
        
        // ORDER BY
        if (sql.includes('ORDER BY rating DESC')) {
          results.sort((a, b) => b.rating - a.rating);
        } else if (sql.includes('ORDER BY name ASC')) {
          results.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        // LIMIT and OFFSET
        const limitMatch = sql.match(/LIMIT \$(\d+)/);
        const offsetMatch = sql.match(/OFFSET \$(\d+)/);
        if (limitMatch && offsetMatch) {
          const limit = params[parseInt(limitMatch[1]) - 1];
          const offset = params[parseInt(offsetMatch[1]) - 1];
          results = results.slice(offset, offset + limit);
        }
        
        return { rows: results };
      }

      // Player Stats
      if (sql.includes('FROM player_stats')) {
        const stats = [];
        if (sql.includes('WHERE player_id = $1') && params[0]) {
          // Would return stats but mock doesn't have them
        }
        return { rows: stats };
      }

      // Tournaments
      if (sql.includes('FROM tournaments')) {
        let results = [...db.tournaments];
        
        if (sql.includes('WHERE id = $1') && params[0]) {
          results = results.filter(t => t.id === parseInt(params[0]));
        }
        
        if (sql.includes('LIMIT')) {
          const limitMatch = sql.match(/LIMIT \$(\d+)/);
          const offsetMatch = sql.match(/OFFSET \$(\d+)/);
          if (limitMatch && offsetMatch) {
            const limit = params[parseInt(limitMatch[1]) - 1];
            const offset = params[parseInt(offsetMatch[1]) - 1];
            results = results.slice(offset, offset + limit);
          }
        }
        
        return { rows: results };
      }

      // Matches
      if (sql.includes('FROM matches')) {
        let results = [...db.matches];
        
        if (sql.includes('WHERE')) {
          if (sql.includes('tournament_id = $1')) {
            results = results.filter(m => m.tournament_id === parseInt(params[0]));
          }
          if (sql.includes('player1_id = $1 OR player2_id = $1')) {
            const playerId = parseInt(params[0]);
            results = results.filter(m => m.player1_id === playerId || m.player2_id === playerId);
          }
          if (sql.includes('id = $1')) {
            results = results.filter(m => m.id === parseInt(params[0]));
          }
        }
        
        return { rows: results };
      }

      // Users
      if (sql.includes('FROM users')) {
        let results = [...db.users];
        
        if (sql.includes('WHERE email = $1')) {
          results = results.filter(u => u.email === params[0]);
        }
        if (sql.includes('WHERE id = $1')) {
          results = results.filter(u => u.id === parseInt(params[0]));
        }
        
        return { rows: results };
      }

      // News
      if (sql.includes('FROM news')) {
        let results = [...db.news];
        
        if (sql.includes('WHERE id = $1')) {
          results = results.filter(n => n.id === parseInt(params[0]));
        }
        
        if (sql.includes('LIMIT')) {
          const limitMatch = sql.match(/LIMIT \$(\d+)/);
          const offsetMatch = sql.match(/OFFSET \$(\d+)/);
          if (limitMatch && offsetMatch) {
            const limit = params[parseInt(limitMatch[1]) - 1];
            const offset = params[parseInt(offsetMatch[1]) - 1];
            results = results.slice(offset, offset + limit);
          }
        }
        
        return { rows: results };
      }

      // Rankings
      if (sql.includes('rankings')) {
        return { rows: db.players.sort((a, b) => b.rating - a.rating) };
      }
    }
    
    // ===== INSERT QUERIES =====
    if (sql.includes('INSERT')) {
      // Insert Players
      if (sql.includes('INSERT INTO players')) {
        const id = nextPlayerId++;
        const player = {
          id,
          name: params[0],
          age: params[1] || null,
          club: params[2] || null,
          nationality: params[3] || 'Mongolia',
          rating: params[4] || 1000,
          peak_rating: params[4] || 1000,
          total_matches: 0,
          wins: 0,
          losses: 0,
          created_at: new Date(),
          updated_at: new Date(),
        };
        db.players.push(player);
        return { rows: [player] };
      }

      // Insert Player Stats
      if (sql.includes('INSERT INTO player_stats')) {
        return { rows: [{ id: 1 }] };
      }

      // Insert Tournaments
      if (sql.includes('INSERT INTO tournaments')) {
        const id = nextTournamentId++;
        const tournament = {
          id,
          name: params[0],
          start_date: params[1],
          end_date: params[2],
          location: params[3] || null,
          type: params[4],
          description: params[5] || null,
          created_at: new Date(),
          updated_at: new Date(),
        };
        db.tournaments.push(tournament);
        return { rows: [tournament] };
      }

      // Insert Matches
      if (sql.includes('INSERT INTO matches')) {
        const id = nextMatchId++;
        const match = {
          id,
          tournament_id: params[0],
          player1_id: params[1],
          player2_id: params[2],
          winner_id: params[3],
          player1_set_wins: 0,
          player2_set_wins: 0,
          total_sets: params[4],
          played_at: params[5],
          created_at: new Date(),
          updated_at: new Date(),
        };
        db.matches.push(match);
        return { rows: [match] };
      }

      // Insert News
      if (sql.includes('INSERT INTO news')) {
        const id = nextNewsId++;
        const news = {
          id,
          title: params[0],
          content: params[1],
          author_id: params[2],
          published: params[3] || false,
          created_at: new Date(),
          updated_at: new Date(),
        };
        db.news.push(news);
        return { rows: [news] };
      }

      // Insert Users
      if (sql.includes('INSERT INTO users')) {
        const user = {
          id: db.users.length + 1,
          email: params[0],
          password_hash: params[1],
          name: params[2],
          role: params[3],
          created_at: new Date(),
          updated_at: new Date(),
        };
        db.users.push(user);
        return { rows: [user] };
      }
    }

    // ===== UPDATE QUERIES =====
    if (sql.includes('UPDATE')) {
      // Update Players
      if (sql.includes('UPDATE players')) {
        const updates = {};
        const whereIndex = sql.indexOf('WHERE');
        const updatePart = sql.substring('UPDATE players SET '.length, whereIndex);
        
        // Parse the update fields
        let paramIndex = 0;
        if (updatePart.includes('name = $')) updates.name = params[paramIndex++];
        if (updatePart.includes('age = $')) updates.age = params[paramIndex++];
        if (updatePart.includes('club = $')) updates.club = params[paramIndex++];
        if (updatePart.includes('nationality = $')) updates.nationality = params[paramIndex++];
        updates.updated_at = new Date();

        const playerId = params[params.length - 1];
        const playerIndex = db.players.findIndex(p => p.id === parseInt(playerId));
        
        if (playerIndex !== -1) {
          db.players[playerIndex] = { ...db.players[playerIndex], ...updates };
          return { rows: [db.players[playerIndex]] };
        }
        return { rows: [] };
      }

      // Update Tournaments
      if (sql.includes('UPDATE tournaments')) {
        const tournamentId = params[params.length - 1];
        const tournamentIndex = db.tournaments.findIndex(t => t.id === parseInt(tournamentId));
        
        if (tournamentIndex !== -1) {
          const updates = {};
          let paramIndex = 0;
          const updatePart = sql.substring('UPDATE tournaments SET '.length, sql.indexOf('WHERE'));
          
          if (updatePart.includes('name = $')) updates.name = params[paramIndex++];
          if (updatePart.includes('start_date = $')) updates.start_date = params[paramIndex++];
          if (updatePart.includes('end_date = $')) updates.end_date = params[paramIndex++];
          if (updatePart.includes('location = $')) updates.location = params[paramIndex++];
          if (updatePart.includes('type = $')) updates.type = params[paramIndex++];
          if (updatePart.includes('description = $')) updates.description = params[paramIndex++];
          updates.updated_at = new Date();

          db.tournaments[tournamentIndex] = { ...db.tournaments[tournamentIndex], ...updates };
          return { rows: [db.tournaments[tournamentIndex]] };
        }
        return { rows: [] };
      }

      // Update News
      if (sql.includes('UPDATE news')) {
        const newsId = params[params.length - 1];
        const newsIndex = db.news.findIndex(n => n.id === parseInt(newsId));
        
        if (newsIndex !== -1) {
          const updates = {};
          let paramIndex = 0;
          const updatePart = sql.substring('UPDATE news SET '.length, sql.indexOf('WHERE'));
          
          if (updatePart.includes('title = $')) updates.title = params[paramIndex++];
          if (updatePart.includes('content = $')) updates.content = params[paramIndex++];
          if (updatePart.includes('published = $')) updates.published = params[paramIndex++];
          updates.updated_at = new Date();

          db.news[newsIndex] = { ...db.news[newsIndex], ...updates };
          return { rows: [db.news[newsIndex]] };
        }
        return { rows: [] };
      }
    }

    // ===== DELETE QUERIES =====
    if (sql.includes('DELETE')) {
      // Delete Players
      if (sql.includes('DELETE FROM players')) {
        const playerId = params[0];
        const index = db.players.findIndex(p => p.id === parseInt(playerId));
        
        if (index !== -1) {
          const deleted = db.players.splice(index, 1);
          return { rows: deleted };
        }
        return { rows: [] };
      }

      // Delete Tournaments
      if (sql.includes('DELETE FROM tournaments')) {
        const tournamentId = params[0];
        const index = db.tournaments.findIndex(t => t.id === parseInt(tournamentId));
        
        if (index !== -1) {
          const deleted = db.tournaments.splice(index, 1);
          return { rows: deleted };
        }
        return { rows: [] };
      }

      // Delete News
      if (sql.includes('DELETE FROM news')) {
        const newsId = params[0];
        const index = db.news.findIndex(n => n.id === parseInt(newsId));
        
        if (index !== -1) {
          const deleted = db.news.splice(index, 1);
          return { rows: deleted };
        }
        return { rows: [] };
      }

      // Delete Matches
      if (sql.includes('DELETE FROM matches')) {
        const matchId = params[0];
        const index = db.matches.findIndex(m => m.id === parseInt(matchId));
        
        if (index !== -1) {
          const deleted = db.matches.splice(index, 1);
          return { rows: deleted };
        }
        return { rows: [] };
      }
    }
    
    return { rows: [] };
  },
  
  connect: async () => {
    return {
      query: async (...args) => pool.query(...args),
      release: () => {}
    };
  }
};

module.exports = pool;
