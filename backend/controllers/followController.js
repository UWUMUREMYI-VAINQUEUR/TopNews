const db = require('../config/db');
const { sendNotification } = require('../sockets/notificationSocket');

exports.followUser = async (req, res) => {
  const follower_user_id = req.user.id;
  const { followed_user_id } = req.body;

  if (!followed_user_id) return res.status(400).json({ message: 'User ID to follow is required' });
  if (follower_user_id === followed_user_id) return res.status(400).json({ message: 'Cannot follow yourself' });

  try {
    await db.query(
      'INSERT INTO followers (follower_user_id, followed_user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [follower_user_id, followed_user_id]
    );

    await sendNotification(followed_user_id, 'new_follower', {
      from_user_id: follower_user_id,
      message: `You have a new follower`
    });

    res.json({ message: 'User followed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unfollowUser = async (req, res) => {
  const follower_user_id = req.user.id;
  const { followed_user_id } = req.body;

  try {
    await db.query(
      'DELETE FROM followers WHERE follower_user_id=$1 AND followed_user_id=$2',
      [follower_user_id, followed_user_id]
    );

    res.json({ message: 'User unfollowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
