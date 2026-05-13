const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const send2FACode = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>TopNews Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #f97316; letter-spacing: 8px;">${code}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`2FA code sent to ${email}`);
  } catch (err) {
    console.error('Error sending 2FA email:', err);
    throw err;
  }
};

module.exports = { send2FACode };