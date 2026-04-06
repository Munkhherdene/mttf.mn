/**
 * Auth Service
 * User authentication and JWT token generation
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * Register new user
 */
async function register(userData) {
  const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [userData.email]);

  if (existingUser.rows.length > 0) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const query = `
    INSERT INTO users (email, password_hash, name, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, name, role, created_at
  `;

  const result = await pool.query(query, [userData.email, hashedPassword, userData.name, 'editor']);

  return result.rows[0];
}

/**
 * Login user and generate JWT token
 */
async function login(email, password) {
  const userQuery = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(userQuery, [email]);

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  const query = 'SELECT id, email, name, role, created_at FROM users WHERE id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

module.exports = {
  register,
  login,
  getUserById,
};
