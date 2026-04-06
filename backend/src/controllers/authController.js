/**
 * Auth Controller
 * HTTP request handlers for authentication endpoints
 */

const authService = require('../services/authService');

/**
 * POST /auth/register
 * Register new user
 */
async function register(req, res) {
  try {
    const user = await authService.register(req.validatedData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * POST /auth/login
 * Login user and return JWT token
 */
async function login(req, res) {
  try {
    const result = await authService.login(req.validatedData.email, req.validatedData.password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * GET /auth/me
 * Get current user info (requires auth)
 */
async function getCurrentUser(req, res) {
  try {
    const user = await authService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: err.message,
    });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
};
