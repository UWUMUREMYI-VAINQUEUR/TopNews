const db = require('../config/db');

exports.getNotifications = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await db.query(
      `SELECT
         n.id AS notification_id,
         n.type,
         n.data,
         n.read,
         n.created_at,
         u.username AS sender_name,
         u.email AS sender_email
       FROM notifications n
       LEFT JOIN users u
         ON u.id = (n.data->>'from_user_id')::int
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  const user_id = req.user.id;
  const { notification_id } = req.body;

  if (!notification_id) return res.status(400).json({ message: 'Notification ID required' });

  try {
    await db.query(
      'UPDATE notifications SET read=true WHERE id=$1 AND user_id=$2',
      [notification_id, user_id]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
