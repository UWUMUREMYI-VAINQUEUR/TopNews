const db = require('../config/db');

exports.getTags = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM tags ORDER BY name`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTag = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const result = await db.query(
      'INSERT INTO tags (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTag = async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM tags WHERE id=$1', [id]);
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
