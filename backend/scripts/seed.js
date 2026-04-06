/**
 * Database Seed Script
 * Populates the database with sample data for development and testing
 */

const pool = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  const client = await pool.connect();

  try {
    console.log('Starting database seeding...');

    // Seed Users
    console.log('Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    await client.query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
      [
        'admin@mttf.mn',
        hashedPassword,
        'Admin User',
        'admin',
        'editor@mttf.mn',
        hashedPassword,
        'Editor User',
        'editor',
      ]
    );

    // Seed Players
    console.log('Seeding players...');
    const players = [
      ['Монхбат Баярсайхан', 28, 'UB Club', 'Mongolia', 1200],
      ['Отгончимэг Оюуна', 25, 'Darkhan Club', 'Mongolia', 1150],
      ['Батэнхүү Цогт', 32, 'UB Club', 'Mongolia', 1100],
      ['Энхтүүл Солонгонуур', 23, 'Ulaanbaatar TTC', 'Mongolia', 1050],
      ['Дашдорж Хүүхэлтэй', 27, 'Darkhan Club', 'Mongolia', 1000],
      ['Сарнай Оюун', 30, 'UB Club', 'Mongolia', 980],
      ['Түмэрбулан Батор', 22, 'Ulaanbaatar TTC', 'Mongolia', 950],
      ['Жаргалсайхан Ээж', 26, 'Sports Academy', 'Mongolia', 920],
      ['Намсрайпүрэв Чагар', 29, 'UB Club', 'Mongolia', 900],
      ['Хүүхэлбат Баттолга', 24, 'Darkhan Club', 'Mongolia', 880],
    ];

    for (const [name, age, club, nationality, rating] of players) {
      await client.query(
        `INSERT INTO players (name, age, club, nationality, rating, peak_rating)
         VALUES ($1, $2, $3, $4, $5, $5)`,
        [name, age, club, nationality, rating]
      );
    }

    // Get inserted players
    const playerResult = await client.query('SELECT id FROM players ORDER BY id LIMIT 10');
    const playerIds = playerResult.rows.map((r) => r.id);

    // Seed Tournaments
    console.log('Seeding tournaments...');
    const tournaments = [
      ['National Championship 2026', '2026-03-15', '2026-03-22', 'Ulaanbaatar', 'National', 'Annual national tournament'],
      ['Spring Open 2026', '2026-04-10', '2026-04-15', 'Ulaanbaatar', 'International', 'Spring international open'],
      ['Club Tournament', '2026-02-01', '2026-02-08', 'Darkhan', 'Club', 'Club level tournament'],
    ];

    const tournamentResults = [];
    for (const [name, start_date, end_date, location, type, description] of tournaments) {
      const result = await client.query(
        `INSERT INTO tournaments (name, start_date, end_date, location, type, description)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [name, start_date, end_date, location, type, description]
      );
      tournamentResults.push(result.rows[0]);
    }

    // Seed Matches with Sets
    console.log('Seeding matches...');
    const matchData = [
      [tournamentResults[0].id, playerIds[0], playerIds[1], playerIds[0], '2026-03-16 10:00:00'],
      [tournamentResults[0].id, playerIds[2], playerIds[3], playerIds[2], '2026-03-16 11:00:00'],
      [tournamentResults[0].id, playerIds[4], playerIds[5], playerIds[4], '2026-03-16 12:00:00'],
      [tournamentResults[1].id, playerIds[0], playerIds[4], playerIds[0], '2026-04-11 10:00:00'],
      [tournamentResults[1].id, playerIds[1], playerIds[2], playerIds[2], '2026-04-11 11:00:00'],
    ];

    for (const [tournament_id, player1_id, player2_id, winner_id, played_at] of matchData) {
      const matchResult = await client.query(
        `INSERT INTO matches (tournament_id, player1_id, player2_id, winner_id, total_sets, played_at)
         VALUES ($1, $2, $3, $4, 3, $5) RETURNING id`,
        [tournament_id, player1_id, player2_id, winner_id, played_at]
      );

      const matchId = matchResult.rows[0].id;

      // Insert match sets
      const sets = [
        [matchId, 1, 11, 8],
        [matchId, 2, 11, 9],
        [matchId, 3, 10, 12],
      ];

      for (const [match_id, set_number, p1_score, p2_score] of sets) {
        await client.query(
          `INSERT INTO match_sets (match_id, set_number, player1_score, player2_score)
           VALUES ($1, $2, $3, $4)`,
          [match_id, set_number, p1_score, p2_score]
        );
      }
    }

    // Seed News
    console.log('Seeding news...');
    const newsArticles = [
      ['National Championship 2026 Announced', 'The National Table Tennis Championship 2026 has been officially announced. The tournament will be held from March 15-22 at the Ulaanbaatar Sports Complex.', 1, true],
      ['New ELO Ranking System Implemented', 'The federation has implemented a new ELO-based ranking system to ensure fair and transparent player ratings based on match results.', 1, true],
      ['Spring International Open Registration Open', 'Registration for the Spring International Open 2026 is now open. Players from across Asia are welcome to participate.', 2, true],
    ];

    for (const [title, content, author_id, published] of newsArticles) {
      await client.query(
        `INSERT INTO news (title, content, author_id, published)
         VALUES ($1, $2, $3, $4)`,
        [title, content, author_id, published]
      );
    }

    // Seed Configuration
    console.log('Seeding configuration...');
    const config = [
      ['ELO_K_FACTOR', '32'],
      ['ELO_BASE_RATING', '1000'],
      ['FEDERATION_NAME', 'Mongolian Table Tennis Federation'],
    ];

    for (const [key, value] of config) {
      await client.query(
        `INSERT INTO config (key, value)
         VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = $2`,
        [key, value]
      );
    }

    // Seed Player Stats
    console.log('Seeding player stats...');
    for (const playerId of playerIds) {
      await client.query(
        `INSERT INTO player_stats (player_id, win_rate, last_10_wins, last_10_matches)
         VALUES ($1, 0.5, 5, 10)`,
        [playerId]
      );
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Seeded Data Summary:`);
    console.log(`   • Users: 2`);
    console.log(`   • Players: ${playerIds.length}`);
    console.log(`   • Tournaments: ${tournamentResults.length}`);
    console.log(`   • Matches: ${matchData.length}`);
    console.log(`   • News Articles: ${newsArticles.length}`);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

seedData();
