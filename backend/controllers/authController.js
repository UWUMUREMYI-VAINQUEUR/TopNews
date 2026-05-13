const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { send2FACode } = require('../services/mailService');
require('dotenv').config();

// Store code + expiry time
let tempVerificationCodes = {};

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// =================== SIGNUP ===================
exports.signup = async (req, res) => {
  const { email, phone, username, password } = req.body || {};

  if (!email || !phone || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userCheck = await db.query(
      'SELECT * FROM users WHERE email=$1 OR phone=$2 OR username=$3',
      [email, phone, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User with email/phone/username already exists' });
    }

    const code = generateCode();

    // Store code with expiry (10 minutes)
    tempVerificationCodes[email] = {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    await send2FACode(email, code);

    res.json({ message: 'Verification code sent to email. Please verify to complete signup.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =================== VERIFY 2FA ===================
exports.verify2FA = async (req, res) => {
  const { email, code, phone, username, password } = req.body || {};

  if (!email || !code || !phone || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const record = tempVerificationCodes[email];

  // Check code exists
  if (!record) {
    return res.status(400).json({ message: 'No verification code found. Please sign up again.' });
  }

  // Check expiry
  if (Date.now() > record.expiresAt) {
    delete tempVerificationCodes[email];
    return res.status(400).json({ message: 'Verification code expired. Please sign up again.' });
  }

  // Check code matches
  if (record.code !== code) {
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      `INSERT INTO users (email, phone, username, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, role`,
      [email, phone, username, hashedPassword]
    );

    delete tempVerificationCodes[email];

    const token = jwt.sign(
      {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        username: newUser.rows[0].username,
        role: newUser.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Signup successful', token });
  } catch (err) {
    console.error('Verify 2FA error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =================== LOGIN ===================
exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body || {};

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'Email/username and password required' });
  }

  try {
    const userRes = await db.query(
      'SELECT * FROM users WHERE email=$1 OR username=$1',
      [emailOrUsername]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userRes.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};