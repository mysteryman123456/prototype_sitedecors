const { Token } = require("../model/tokenModel");
const { Users } = require("../model/userModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.JWT_KEY;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "decorssite@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Generate a random token
const generateToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

const send_email_verification_token = async (req, res) => {
  const { email } = req.params;
  try {
    const ev_token = generateToken();
    const ev_expiry = new Date(Date.now() + 15 * 60 * 1000); 
    await Token.upsert({ email, ev_token, ev_expiry });
    const signedToken = jwt.sign(
      { email, ev_token },
      SECRET_KEY,
      { expiresIn: "15m" } 
    );

    const verificationLink = `${process.env.BACKEND_URL}/api/verify-email?token=${signedToken}`;

    transporter.sendMail({
      from: "",
      to: email,
      subject: "Email Verification",
      html: `<p>Click the following link to verify your email: <a href="${verificationLink}">Verify Email</a></p>`,
    });
    return res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Please try again later" });
  }
};

const verify_email_token = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { email, ev_token } = decoded;
    const record = await Token.findOne({ where: { email } });
    if (!record || record.ev_token !== ev_token || new Date() > record.ev_expiry) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    await Token.update({ ev_token: null, ev_expiry: null }, { where: { email } });
    await Users.update({ verified: true }, { where: { email } });
    const user = await Users.findOne({ where: { email } });
    return res.status(200).redirect(`${process.env.FRONTEND_URL}/auth/login`);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Error verifying email" });
  }
};


const send_password_reset_token = async (req ,res)=>{
  const { email } = req.params;
  try {
    const pr_token = generateToken();
    const pr_expiry = new Date(Date.now() + 15 * 60 * 1000);
    await Token.upsert({ email, pr_token , pr_expiry });
    const signedToken = jwt.sign(
      { email, pr_token },
      SECRET_KEY,
      { expiresIn: "15m" } 
    );
    const passwordResetLink = `${process.env.BACKEND_URL}/api/reset-password?token=${signedToken}`;
    transporter.sendMail({
      from: "",
      to: email,
      subject: "Password Reset",
      html: `<p>Click the following link to reset your password: <a href="${passwordResetLink}">Reset password</a></p>`,
    });
    await Token.upsert({ email, pr_token, pr_expiry});
    return res.status(200).json({ message: "Token sent !" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Please try again later" , err : err.message});
  }
}

module.exports = {
  send_email_verification_token,
  verify_email_token,
  send_password_reset_token
};
