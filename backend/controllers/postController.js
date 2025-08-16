const db = require('../config/db');

// ==================== Create Post ====================
exports.createPost = async (req, res) => {
  const user_id = req.user.id;
  const { title, snippet, body, image_url, video_url, category_id, tags } = req.body;

  try {
    // Insert the post
    const postRes = await db.query(
      `INSERT INTO posts (user_id, title, snippet, body, image_url, video_url, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, title, snippet, body, image_url, video_url, category_id]
    );
    const postId = postRes.rows[0].id;

    // Insert tags efficiently using CTE
    if (tags && tags.length > 0) {
      const tagValues = tags.map((t, i) => `($${i + 1})`).join(',');
      const existingTags = await db.query(
        `SELECT id, name FROM tags WHERE name IN (${tags.map((_, i) => `$${i + 1}`).join(',')})`,
        tags
      );
      const existingTagMap = Object.fromEntries(existingTags.rows.map(r => [r.name, r.id]));

      const newTags = tags.filter(t => !existingTagMap[t]);
      let newTagIds = [];
      if (newTags.length > 0) {
        const insertTags = await db.query(
          `INSERT INTO tags (name) VALUES ${newTags.map((_, i) => `($${i + 1})`).join(',')} RETURNING id, name`,
          newTags
        );
        insertTags.rows.forEach(r => (existingTagMap[r.name] = r.id));
      }

      // Insert into post_tags
      const postTagValues = tags.map((t, i) => `(${postId}, ${existingTagMap[t]})`).join(',');
      await db.query(`INSERT INTO post_tags (post_id, tag_id) VALUES ${postTagValues} ON CONFLICT DO NOTHING`);
    }

    res.json({ message: 'Post created', post: postRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== List Posts ====================
exports.listPosts = async (req, res) => {
  try {
    const { category, search, limit = 6, offset = 0 } = req.query;
    const params = [];
    let idx = 1;

    let where = [];
    if (category) {
      where.push(`posts.category_id = $${idx++}`);
      params.push(category);
    }
    if (search) {
      where.push(`posts.title ILIKE $${idx++}`);
      params.push(`%${search}%`);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const postsQuery = `
      SELECT 
        posts.id, posts.title, posts.snippet, posts.image_url, posts.video_url, posts.created_at,
        posts.category_id, categories.name AS category_name,
        users.username AS author, users.id AS author_id, users.avatar_url AS author_avatar_url,
        COALESCE(json_agg(json_build_object('id', tags.id, 'name', tags.name)) FILTER (WHERE tags.id IS NOT NULL), '[]') AS tags
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN categories ON posts.category_id = categories.id
      LEFT JOIN post_tags ON post_tags.post_id = posts.id
      LEFT JOIN tags ON post_tags.tag_id = tags.id
      ${whereClause}
      GROUP BY posts.id, users.id, categories.id
      ORDER BY posts.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    params.push(limit, offset);
    const postsRes = await db.query(postsQuery, params);
    res.json(postsRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== Get Single Post ====================
exports.getPostById = async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user ? req.user.id : null;

  if (isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID' });

  try {
    const postRes = await db.query(
      `
      SELECT 
        posts.*, 
        users.username AS author, users.id AS author_id, users.avatar_url AS author_avatar_url,
        COALESCE(json_agg(json_build_object('id', tags.id, 'name', tags.name)) FILTER (WHERE tags.id IS NOT NULL), '[]') AS tags
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN post_tags ON post_tags.post_id = posts.id
      LEFT JOIN tags ON post_tags.tag_id = tags.id
      WHERE posts.id = $1
      GROUP BY posts.id, users.id
      `,
      [postId]
    );

    if (postRes.rows.length === 0) return res.status(404).json({ message: 'Post not found' });

    const post = postRes.rows[0];

    // Check if user follows author
    let followed = false;
    if (userId) {
      const followRes = await db.query(
        `SELECT 1 FROM followers WHERE follower_user_id = $1 AND followed_user_id = $2`,
        [userId, post.user_id]
      );
      followed = followRes.rows.length > 0;
    }

    res.json({ ...post, followed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== Likes & Dislikes ====================
exports.getLikesDislikesCount = async (req, res) => {
  const postId = req.params.id;
  try {
    const result = await db.query(
      `SELECT
        COUNT(CASE WHEN type='like' THEN 1 END) AS likes,
        COUNT(CASE WHEN type='dislike' THEN 1 END) AS dislikes
       FROM likes_dislikes WHERE post_id=$1`,
      [postId]
    );
    res.json({
      likes: parseInt(result.rows[0].likes),
      dislikes: parseInt(result.rows[0].dislikes),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserReaction = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT type FROM likes_dislikes WHERE post_id=$1 AND user_id=$2`,
      [postId, userId]
    );
    res.json({ reaction: result.rows.length ? result.rows[0].type : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likeDislikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { type } = req.body;

  if (!['like', 'dislike'].includes(type)) return res.status(400).json({ message: 'Invalid reaction type' });

  try {
    const existing = await db.query(
      `SELECT * FROM likes_dislikes WHERE post_id=$1 AND user_id=$2`,
      [postId, userId]
    );

    if (existing.rows.length === 0) {
      await db.query(`INSERT INTO likes_dislikes (post_id, user_id, type) VALUES ($1,$2,$3)`, [postId, userId, type]);
    } else if (existing.rows[0].type === type) {
      await db.query(`DELETE FROM likes_dislikes WHERE post_id=$1 AND user_id=$2`, [postId, userId]);
    } else {
      await db.query(`UPDATE likes_dislikes SET type=$1 WHERE post_id=$2 AND user_id=$3`, [type, postId, userId]);
    }

    res.json({ message: 'Reaction updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== Follow/Unfollow ====================
exports.followUser = async (req, res) => {
  const followerUserId = req.user.id;
  const followedUserId = req.body.followed_user_id;

  try {
    await db.query(
      `INSERT INTO followers (follower_user_id, followed_user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [followerUserId, followedUserId]
    );
    res.json({ message: 'User followed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unfollowUser = async (req, res) => {
  const followerUserId = req.user.id;
  const followedUserId = req.body.followed_user_id;

  try {
    await db.query(
      `DELETE FROM followers WHERE follower_user_id=$1 AND followed_user_id=$2`,
      [followerUserId, followedUserId]
    );
    res.json({ message: 'User unfollowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
