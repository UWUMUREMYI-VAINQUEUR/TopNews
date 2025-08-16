const db = require('../config/db');

exports.likeDislikePost = async (req, res) => {
  const user_id = req.user.id;
  const { post_id, type } = req.body; // type = 'like' or 'dislike'

  if (!post_id || !['like', 'dislike'].includes(type)) {
    return res.status(400).json({ message: 'Post ID and valid type are required' });
  }

  try {
    // Check if user already liked/disliked this post
    const existing = await db.query(
      'SELECT * FROM likes_dislikes WHERE post_id=$1 AND user_id=$2',
      [post_id, user_id]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].type === type) {
        // Undo like/dislike
        await db.query('DELETE FROM likes_dislikes WHERE post_id=$1 AND user_id=$2', [post_id, user_id]);
        return res.json({ message: `${type} removed` });
      } else {
        // Update type
        await db.query('UPDATE likes_dislikes SET type=$1 WHERE post_id=$2 AND user_id=$3', [type, post_id, user_id]);
        return res.json({ message: `Changed to ${type}` });
      }
    } else {
      // Insert new
      await db.query('INSERT INTO likes_dislikes (post_id, user_id, type) VALUES ($1, $2, $3)', [post_id, user_id, type]);
      return res.json({ message: `${type} added` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
