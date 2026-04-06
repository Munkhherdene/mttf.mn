/**
 * News Routes
 */

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');

// Public routes
router.get('/', newsController.getNews);
router.get('/:id', newsController.getNewsById);

// Admin routes
router.get('/admin/all', verifyToken, requireRole(['admin', 'editor']), newsController.getAllNews);

router.post(
  '/',
  verifyToken,
  requireRole(['admin', 'editor']),
  validate(schemas.createNews),
  newsController.createNews
);

router.patch(
  '/:id',
  verifyToken,
  requireRole(['admin', 'editor']),
  validate(schemas.updateNews),
  newsController.updateNews
);

router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  newsController.deleteNews
);

module.exports = router;
