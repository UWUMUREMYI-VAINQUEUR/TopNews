const db = require('../config/db');

exports.searchPosts = async (req, res) => {
  let {
    search = '',
    category = '',
    tag = '',
    author = '',
    sort = 'created_at',
    order = 'desc',
    page = 1,
    limit = 12,
  } = req.query;

  search = search?.toString().trim() || '';
  category = category?.toString().trim() || '';
  tag = tag?.toString().trim() || '';
  author = author?.toString().trim() || '';
  sort = sort?.toString().trim() || 'created_at';
  order = order?.toString().trim().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 12;

  const offset = (page - 1) * limit;

  let filters = [];
  let values = [];
  let idx = 1;
  let tagJoin = '';

  if (category !== '') {
    if (/^\d+$/.test(category)) {
      filters.push(`posts.category_id = $${idx++}`);
      values.push(parseInt(category, 10));
    } else {
      filters.push(`categories.name = $${idx++}`);
      values.push(category);
    }
  }

  if (author !== '') {
    filters.push(`users.username = $${idx++}`);
    values.push(author);
  }

  if (search !== '') {
    filters.push(
      `(
         posts.title ILIKE '%' || $${idx} || '%' OR
         posts.snippet ILIKE '%' || $${idx + 1} || '%' OR
         posts.body ILIKE '%' || $${idx + 2} || '%'
       )`
    );
    values.push(search, search, search);
    idx += 3;
  }

  if (tag !== '') {
    tagJoin = `
      JOIN post_tags ON posts.id = post_tags.post_id
      JOIN tags ON post_tags.tag_id = tags.id AND tags.name = $${idx++}
    `;
    values.push(tag);
  }

  const whereClause = filters.length ? 'WHERE ' + filters.join(' AND ') : '';

  let orderBy;
  switch (sort) {
    case 'likes':
    case 'most_liked':
      orderBy = 'likes_count';
      break;
    case 'comments':
    case 'most_commented':
      orderBy = 'comments_count';
      break;
    case 'created_at':
    default:
      orderBy = 'posts.created_at';
      break;
  }

  try {
    const countSQL = `
      SELECT COUNT(DISTINCT posts.id) AS total
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      LEFT JOIN categories ON posts.category_id = categories.id
      ${tagJoin}
      ${whereClause}
    `;

    const countResult = await db.query(countSQL, values);
    const total = parseInt(countResult.rows[0]?.total, 10) || 0;

    const mainSQL = `
      SELECT
        posts.id,
        posts.title,
        posts.snippet,
        posts.image_url,
        posts.created_at,
        COALESCE(users.username, 'Anonymous') AS author,
        categories.id AS category_id,
        categories.name AS category,
        COALESCE(likes.likes_count, 0) AS likes_count,
        COALESCE(comments.comments_count, 0) AS comments_count
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      LEFT JOIN categories ON posts.category_id = categories.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS likes_count
        FROM likes_dislikes WHERE type = 'like' GROUP BY post_id
      ) likes ON posts.id = likes.post_id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comments_count
        FROM comments GROUP BY post_id
      ) comments ON posts.id = comments.post_id
      ${tagJoin}
      ${whereClause}
      GROUP BY posts.id, users.username, categories.id, categories.name, likes.likes_count, comments.comments_count
      ORDER BY ${orderBy} ${order}
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    const mainValues = [...values, limit, offset];
    const postsResult = await db.query(mainSQL, mainValues);

    return res.json({
      total,
      page,
      limit,
      posts: postsResult.rows,
    });
  } catch (err) {
    console.error('searchPosts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
