exports.listPosts = async (req, res) => {
  const { category } = req.query; // expect category ID here (optional)

  try {
    let query = `
      SELECT posts.id, posts.title, posts.snippet, posts.image_url, posts.created_at, 
             users.username as author, categories.id as category_id, categories.name as category_name
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN categories ON posts.category_id = categories.id
    `;

    const params = [];
    if (category) {
      query += ' WHERE posts.category_id = $1';
      params.push(category);
    }

    query += ' ORDER BY posts.created_at DESC LIMIT 20';

    const postsRes = await db.query(query, params);

    res.json(postsRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// server/controllers/postsController.js
const db = require('../config/db');

exports.listPosts = async (req, res) => {
  try {
    const postsRes = await db.query(
      `SELECT
         posts.id,
         posts.title,
         posts.snippet,
         posts.image_url,
         posts.created_at,
         COALESCE(users.username, 'Anonymous') AS author,
         categories.id AS category_id,
         categories.name AS category
       FROM posts
       LEFT JOIN users ON posts.user_id = users.id
       LEFT JOIN categories ON posts.category_id = categories.id
       ORDER BY posts.created_at DESC
       LIMIT 50`
    );

    res.json(postsRes.rows);
  } catch (err) {
    console.error('postsController.listPosts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
