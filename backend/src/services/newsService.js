/**
 * News Service
 * Business logic for news articles
 */

const pool = require('../config/database');

/**
 * Get all published news
 */
async function getAllNews(limit = 20, offset = 0, publishedOnly = true) {
  const query = `
    SELECT n.id, n.title, n.content, n.author_id, n.published, 
           n.created_at, n.updated_at, u.name as author_name
    FROM news n
    JOIN users u ON n.author_id = u.id
    ${publishedOnly ? 'WHERE n.published = true' : ''}
    ORDER BY n.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

/**
 * Get news by ID
 */
async function getNewsById(newsId) {
  const query = `
    SELECT n.id, n.title, n.content, n.author_id, n.published, 
           n.created_at, n.updated_at, u.name as author_name
    FROM news n
    JOIN users u ON n.author_id = u.id
    WHERE n.id = $1
  `;

  const result = await pool.query(query, [newsId]);
  return result.rows[0];
}

/**
 * Create news article
 */
async function createNews(newsData, authorId) {
  const query = `
    INSERT INTO news (title, content, author_id, published)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, content, author_id, published, created_at, updated_at
  `;

  const result = await pool.query(query, [
    newsData.title,
    newsData.content,
    authorId,
    newsData.published || false,
  ]);

  return result.rows[0];
}

/**
 * Update news article
 */
async function updateNews(newsId, newsData) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (newsData.title) {
    fields.push(`title = $${paramCount++}`);
    values.push(newsData.title);
  }
  if (newsData.content) {
    fields.push(`content = $${paramCount++}`);
    values.push(newsData.content);
  }
  if (newsData.published !== undefined) {
    fields.push(`published = $${paramCount++}`);
    values.push(newsData.published);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(newsId);

  if (fields.length === 1) return null;

  const query = `
    UPDATE news
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, title, content, author_id, published, created_at, updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Delete news article
 */
async function deleteNews(newsId) {
  const query = 'DELETE FROM news WHERE id = $1 RETURNING id';
  const result = await pool.query(query, [newsId]);
  return result.rows.length > 0;
}

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
