/**
 * News Controller
 * HTTP request handlers for news endpoints
 */

const newsService = require('../services/newsService');

/**
 * GET /news
 * Get published news with pagination
 */
async function getNews(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const news = await newsService.getAllNews(limit, offset, true);

    res.json({
      success: true,
      data: news,
      pagination: { limit, offset },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: err.message,
    });
  }
}

/**
 * GET /news/admin/all
 * Get all news including unpublished (admin only)
 */
async function getAllNews(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const news = await newsService.getAllNews(limit, offset, false);

    res.json({
      success: true,
      data: news,
      pagination: { limit, offset },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: err.message,
    });
  }
}

/**
 * GET /news/:id
 * Get news by ID
 */
async function getNewsById(req, res) {
  try {
    const news = await newsService.getNewsById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    res.json({
      success: true,
      data: news,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: err.message,
    });
  }
}

/**
 * POST /news
 * Create new news article (admin only)
 */
async function createNews(req, res) {
  try {
    const news = await newsService.createNews(req.validatedData, req.user.id);

    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: news,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating news',
      error: err.message,
    });
  }
}

/**
 * PATCH /news/:id
 * Update news article (admin only)
 */
async function updateNews(req, res) {
  try {
    const news = await newsService.updateNews(req.params.id, req.validatedData);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    res.json({
      success: true,
      message: 'News updated successfully',
      data: news,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating news',
      error: err.message,
    });
  }
}

/**
 * DELETE /news/:id
 * Delete news article (admin only)
 */
async function deleteNews(req, res) {
  try {
    const deleted = await newsService.deleteNews(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    res.json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: err.message,
    });
  }
}

module.exports = {
  getNews,
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
