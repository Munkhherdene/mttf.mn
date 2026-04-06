-- MongoDB Table Tennis Federation - Database Schema
-- Production-ready PostgreSQL schema with proper indexing and constraints

-- Users table for admin authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'editor', -- admin, editor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    club VARCHAR(255),
    nationality VARCHAR(100) DEFAULT 'Mongolia',
    rating INT DEFAULT 1000, -- ELO rating
    peak_rating INT DEFAULT 1000,
    total_matches INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments table
CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255),
    type VARCHAR(100) NOT NULL, -- National, International, Club
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player1_id INT NOT NULL REFERENCES players(id),
    player2_id INT NOT NULL REFERENCES players(id),
    winner_id INT REFERENCES players(id),
    player1_set_wins INT DEFAULT 0,
    player2_set_wins INT DEFAULT 0,
    total_sets INT,
    played_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match sets table (detailed scores)
CREATE TABLE match_sets (
    id SERIAL PRIMARY KEY,
    match_id INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    player1_score INT NOT NULL,
    player2_score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rankings table (historical tracking)
CREATE TABLE rankings (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    position INT,
    rating INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player statistics (for quick access)
CREATE TABLE player_stats (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL UNIQUE REFERENCES players(id) ON DELETE CASCADE,
    win_rate DECIMAL(5, 2) DEFAULT 0.00,
    last_10_wins INT DEFAULT 0,
    last_10_matches INT DEFAULT 0,
    head_to_head_json TEXT, -- JSON storage for H2H vs other players
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News articles table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES users(id),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuration table (for K-factor and other settings)
CREATE TABLE config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== INDEXES =====
-- Players indexes
CREATE INDEX idx_players_rating ON players(rating DESC);
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_created_at ON players(created_at DESC);

-- Tournaments indexes
CREATE INDEX idx_tournaments_start_date ON tournaments(start_date DESC);
CREATE INDEX idx_tournaments_type ON tournaments(type);

-- Matches indexes
CREATE INDEX idx_matches_tournament_id ON matches(tournament_id);
CREATE INDEX idx_matches_player1_id ON matches(player1_id);
CREATE INDEX idx_matches_player2_id ON matches(player2_id);
CREATE INDEX idx_matches_winner_id ON matches(winner_id);
CREATE INDEX idx_matches_played_at ON matches(played_at DESC);

-- Match sets indexes
CREATE INDEX idx_match_sets_match_id ON match_sets(match_id);

-- Rankings indexes
CREATE INDEX idx_rankings_player_id ON rankings(player_id);
CREATE INDEX idx_rankings_updated_at ON rankings(updated_at DESC);
CREATE INDEX idx_rankings_position ON rankings(position);

-- Player stats indexes
CREATE INDEX idx_player_stats_player_id ON player_stats(player_id);

-- News indexes
CREATE INDEX idx_news_published ON news(published);
CREATE INDEX idx_news_created_at ON news(created_at DESC);
CREATE INDEX idx_news_author_id ON news(author_id);

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ===== CONSTRAINTS =====
-- Ensure player1 and player2 are different
ALTER TABLE matches
ADD CONSTRAINT different_players CHECK (player1_id != player2_id);

-- Ensure set scores are valid
ALTER TABLE match_sets
ADD CONSTRAINT valid_set_scores CHECK (player1_score >= 0 AND player2_score >= 0);

-- Ensure win/loss counts are correct
ALTER TABLE players
ADD CONSTRAINT valid_wins_losses CHECK (wins >= 0 AND losses >= 0 AND wins + losses = total_matches OR total_matches = 0);
