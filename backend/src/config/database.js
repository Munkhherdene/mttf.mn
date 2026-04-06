/**
 * Database Connection Module
 * SQLite database for persistent data storage
 */

require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dbDir, 'mttf.db');

// Create SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database:', dbPath);
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'editor',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default users if they don't exist
    db.run(`
      INSERT OR IGNORE INTO users (id, email, password_hash, name, role)
      VALUES 
        (1, 'admin@mttf.mn', '$2a$10$9arIBl5SG.ZrpUlsUkO2jeZmGwhCcZSF.9aQPfKsLPRtDwVtqMfWW', 'Admin', 'admin'),
        (2, 'editor@mttf.mn', '$2a$10$9arIBl5SG.ZrpUlsUkO2jeZmGwhCcZSF.9aQPfKsLPRtDwVtqMfWW', 'Editor', 'editor')
    `);

    // Players table
    db.run(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER,
        club TEXT,
        nationality TEXT DEFAULT 'Mongolia',
        rating INTEGER DEFAULT 1000,
        peak_rating INTEGER DEFAULT 1000,
        total_matches INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample players if table is empty
    db.all('SELECT COUNT(*) as count FROM players', (err, rows) => {
      if (err) return;
      if (rows[0].count === 0) {
        const players = [
          {name: 'Тэнгис Батүмөр', age: 28, club: 'UB Club', nationality: 'Mongolia', rating: 1200, peak_rating: 1200, wins: 45, losses: 15, total_matches: 60},
          {name: 'Баярмаа Болд', age: 25, club: 'UB Club', nationality: 'Mongolia', rating: 1150, peak_rating: 1150, wins: 40, losses: 18, total_matches: 58},
          {name: 'Өнөө Баатар', age: 32, club: 'Darkhan Club', nationality: 'Mongolia', rating: 1100, peak_rating: 1100, wins: 35, losses: 20, total_matches: 55},
          {name: 'Батжав Сүхээ', age: 23, club: 'UB Club', nationality: 'Mongolia', rating: 1050, peak_rating: 1050, wins: 30, losses: 25, total_matches: 55},
          {name: 'Мөнхзул Ганзоо', age: 27, club: 'Darkhan Club', nationality: 'Mongolia', rating: 1000, peak_rating: 1000, wins: 25, losses: 25, total_matches: 50}
        ];
        
        players.forEach((player) => {
          db.run(
            `INSERT INTO players (name, age, club, nationality, rating, peak_rating, wins, losses, total_matches) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [player.name, player.age, player.club, player.nationality, player.rating, player.peak_rating, player.wins, player.losses, player.total_matches]
          );
        });
      }
    });

    // Tournaments table
    db.run(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        location TEXT,
        type TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample tournaments if table is empty
    db.all('SELECT COUNT(*) as count FROM tournaments', (err, rows) => {
      if (err) return;
      if (rows[0].count === 0) {
        const tournaments = [
          {name: 'National Championship', start_date: '2026-04-01', end_date: '2026-04-05', location: 'Ulaanbaatar', type: 'National', description: 'Annual national tournament'},
          {name: 'Spring Open', start_date: '2026-03-15', end_date: '2026-03-20', location: 'Ulaanbaatar', type: 'International', description: 'Spring international open'}
        ];
        
        tournaments.forEach((t) => {
          db.run(
            `INSERT INTO tournaments (name, start_date, end_date, location, type, description) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [t.name, t.start_date, t.end_date, t.location, t.type, t.description]
          );
        });
      }
    });

    // Matches table
    db.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
        player1_id INTEGER NOT NULL REFERENCES players(id),
        player2_id INTEGER NOT NULL REFERENCES players(id),
        winner_id INTEGER REFERENCES players(id),
        player1_set_wins INTEGER DEFAULT 0,
        player2_set_wins INTEGER DEFAULT 0,
        total_sets INTEGER,
        played_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // News table
    db.run(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id),
        published BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample news if table is empty
    db.all('SELECT COUNT(*) as count FROM news', (err, rows) => {
      if (err) return;
      if (rows[0].count === 0) {
        db.run(
          `INSERT INTO news (title, content, author_id, published) VALUES (?, ?, ?, ?)`,
          ['National Championship Results', 'Тэнгис won the championship...', 1, true]
        );
        db.run(
          `INSERT INTO news (title, content, author_id, published) VALUES (?, ?, ?, ?)`,
          ['New Player Registration', 'We welcome new players...', 1, true]
        );
      }
    });

    console.log('Database tables initialized successfully');
  });
}

// Promisify database operations for easier use
const pool = {
  query: (sql, params = []) => {
    // Convert PostgreSQL $ parameter syntax to SQLite ? syntax
    let sqliteQuery = sql;
    let paramCount = 1;
    while (sqliteQuery.includes(`$${paramCount}`)) {
      sqliteQuery = sqliteQuery.replace(`$${paramCount}`, '?');
      paramCount++;
    }
    
    return new Promise((resolve, reject) => {
      if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sqliteQuery, params, (err, rows) => {
          if (err) {
            console.error('SQLite Error:', err);
            reject(err);
          }
          else resolve({ rows: rows || [] });
        });
      } else if (sqliteQuery.trim().toUpperCase().startsWith('INSERT') || sqliteQuery.trim().toUpperCase().startsWith('UPDATE') || sqliteQuery.trim().toUpperCase().startsWith('DELETE')) {
        db.run(sqliteQuery, params, function(err) {
          if (err) {
            console.error('SQLite Error:', err);
            reject(err);
          }
          else {
            // Return the inserted/updated row(s)
            const lastId = this.lastID;
            
            if (sql.includes('RETURNING')) {
              const returningMatch = sql.match(/RETURNING\s+(.*?)$/i);
              if (returningMatch && lastId) {
                const tableName = sql.match(/(?:INSERT INTO|UPDATE|DELETE FROM)\s+(\w+)/i)[1];
                const selectSql = `SELECT ${returningMatch[1]} FROM ${tableName} WHERE id = ?`;
                db.all(selectSql, [lastId], (selectErr, rows) => {
                  if (selectErr) resolve({ rows: [] });
                  else resolve({ rows: rows || [] });
                });
              } else {
                resolve({ rows: [] });
              }
            } else {
              resolve({ rows: [] });
            }
          }
        });
      }
    });
  },
  
  connect: async () => {
    return {
      query: (sql, params) => pool.query(sql, params),
      release: () => {}
    };
  }
};

module.exports = pool;
