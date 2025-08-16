const db = require('../config/db');

// Get user profile
exports.getUserProfile = async (req, res) => {
  const username = req.params.username;

  try {
    const userResult = await db.query(
      `SELECT id, username, email, bio, avatar_url, created_at
       FROM users WHERE username=$1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Fetch user's posts summary
    const postsResult = await db.query(
      `SELECT id, title, snippet, image_url, created_at
       FROM posts WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20`,
      [user.id]
    );

    res.json({ user, posts: postsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { bio, avatar_url } = req.body;

  try {
    await db.query(
      `UPDATE users SET bio=$1, avatar_url=$2 WHERE id=$3`,
      [bio, avatar_url, userId]
    );

    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow a user
exports.followUser = async (req, res) => {
  const userId = req.user.id;        // logged-in user
  const followId = parseInt(req.params.id); // user to follow

  if (userId === followId) return res.status(400).json({ message: 'Cannot follow yourself' });

  try {
    await db.query(
      'INSERT INTO followers (user_id, follower_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [followId, userId]
    );
    res.json({ message: 'User followed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  const userId = req.user.id;
  const followId = parseInt(req.params.id);

  try {
    await db.query(
      'DELETE FROM followers WHERE user_id = $1 AND follower_id = $2',
      [followId, userId]
    );
    res.json({ message: 'User unfollowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
