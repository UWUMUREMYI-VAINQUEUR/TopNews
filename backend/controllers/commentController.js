const db = require('../config/db');
const { sendNotification } = require('../sockets/notificationSocket');

// =================== CREATE COMMENT ===================
exports.createComment = async (req, res) => {
  const user_id = req.user.id;
  const { post_id, parent_comment_id = null, body } = req.body;

  // Validate required fields
  if (!post_id || !body) {
    return res.status(400).json({ message: 'Post ID and comment body are required' });
  }

  try {
    // Insert comment
    const insertResult = await db.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, body)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [post_id, user_id, parent_comment_id, body]
    );

    const commentId = insertResult.rows[0].id;

    // Fetch full comment with user info
    const commentRes = await db.query(
      `SELECT c.*, u.username AS commenter_name, u.email AS commenter_email
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [commentId]
    );

    const comment = commentRes.rows[0];

    // Notify post author
    const postAuthorRes = await db.query('SELECT user_id FROM posts WHERE id=$1', [post_id]);
    const postAuthorId = postAuthorRes.rows[0]?.user_id;

    if (postAuthorId && postAuthorId !== user_id) {
      await sendNotification(postAuthorId, 'new_comment', {
        post_id,
        comment_id: comment.id,
        from_user_id: user_id,
        message: 'New comment on your post'
      });
    }

    // Notify parent comment author if this is a reply
    if (parent_comment_id) {
      const parentCommentRes = await db.query('SELECT user_id FROM comments WHERE id=$1', [parent_comment_id]);
      const parentCommentAuthorId = parentCommentRes.rows[0]?.user_id;

      if (parentCommentAuthorId && parentCommentAuthorId !== user_id && parentCommentAuthorId !== postAuthorId) {
        await sendNotification(parentCommentAuthorId, 'reply', {
          post_id,
          comment_id: comment.id,
          from_user_id: user_id,
          message: 'New reply to your comment'
        });
      }
    }

    res.json({ message: 'Comment added', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =================== GET COMMENTS BY POST ===================
exports.getCommentsByPost = async (req, res) => {
  const postId = req.params.post_id; // match your router param
  try {
    const result = await db.query(
      `SELECT c.*, u.username AS commenter_name, u.email AS commenter_email, u.avatar_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =================== REACT TO COMMENT ===================
exports.reactToComment = async (req, res) => {
  const user_id = req.user.id;
  const { comment_id, emoji_type } = req.body;

  if (!comment_id || !emoji_type) {
    return res.status(400).json({ message: 'Comment ID and emoji type are required' });
  }

  try {
    await db.query(
      `INSERT INTO comment_reactions (comment_id, user_id, emoji_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (comment_id, user_id, emoji_type) DO NOTHING`,
      [comment_id, user_id, emoji_type]
    );

    res.json({ message: 'Reaction added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
