const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

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

// Update user profile (bio + optional avatar upload)
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { bio } = req.body;

  let avatar_url = null;

  try {
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'avatars', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        avatar_url = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    await db.query(
      `UPDATE users 
       SET bio=$1, avatar_url=COALESCE($2, avatar_url), updated_at=NOW() 
       WHERE id=$3`,
      [bio, avatar_url, userId]
    );

    res.json({ message: 'Profile updated', avatar_url });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
