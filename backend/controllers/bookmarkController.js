const db = require('../config/db');

exports.addBookmark = async (req, res) => {
  const user_id = req.user.id;
  const { post_id } = req.body;

  if (!post_id) {
    return res.status(400).json({ message: 'Post ID is required' });
  }

  try {
    await db.query(
      'INSERT INTO bookmarks (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [user_id, post_id]
    );

    res.json({ message: 'Post bookmarked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeBookmark = async (req, res) => {
  const user_id = req.user.id;
  const { post_id } = req.body;

  try {
    await db.query(
      'DELETE FROM bookmarks WHERE user_id=$1 AND post_id=$2',
      [user_id, post_id]
    );

    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookmarks = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await db.query(
      `SELECT posts.id, posts.title, posts.snippet, posts.image_url, posts.created_at 
       FROM bookmarks 
       JOIN posts ON bookmarks.post_id = posts.id
       WHERE bookmarks.user_id = $1
       ORDER BY bookmarks.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
