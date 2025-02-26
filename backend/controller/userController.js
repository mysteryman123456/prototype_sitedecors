const { Users } = require("../model/userModel");
const bcrypt = require("bcrypt");
const {Token} = require("../model/tokenModel")
const jwt = require("jsonwebtoken");

// regular signin , signup , and proile code
const addUser = async (req, res) => {
  const { username, email, password } = req.body;
  if(username.trim().length > 30) return res.status(400).json({message : "Username too long!"})
  if(password.trim().length > 30) return res.status(400).json({message : "Password too long!"})
  try {
    const userExist = await Users.findOne({ where: { email } });
    if (userExist)
      return res.status(400).json({ message: "Email is already in use" });

      const hashed_password = await bcrypt.hash(password, 10);

    await Users.create({
      username,
      email,
      password: hashed_password,
    });
    return res.status(201).json({ message: "Registered Successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Please try again later", error : err.message });
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user_exists = await Users.findOne({ where: { email } });
    if (!user_exists)
      return res.status(404).json({ message: "User not found !" });
    if (user_exists.googleLogin === true)
      return res.status(400).json({ message: "Account linked to Google !" });
    const match_password = await bcrypt.compare(password, user_exists.password);
    if (!match_password)
      return res.status(401).json({ message: "Invalid password" });
    if (user_exists.verified != true)
      return res
        .status(401)
        .json({ message: "Email not verified", isVerified: false });
    const jwtToken = jwt.sign(
      {
        email: user_exists.email,
        username: user_exists.username,
        profileImage: user_exists.profileImage || "",
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("sd_tkn", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Please try again later" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, username, new_password, old_password, phonenumber } =
      req.body;
    const profileImage = req.file;
    const user = await Users.findOne({ where: { email } });
    const updateFields = {};
    if(username.trim().length > 30) return res.status(400).json({message : "Username too long!"})
    if(phonenumber.trim().length !== 10) return res.status(400).json({message : "Provide valid phonenumber!"})
    if (old_password.trim() !== "" && new_password.trim() !== "") {
      if(user.googleLogin) return res.status(401).json({message : "Account linked to Google !"})
      if (!(await bcrypt.compare(old_password, user.password))) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      updateFields.password = await bcrypt.hash(new_password, 10);
    }
    if (profileImage) updateFields.profileImage = req.file.path;
    if (username) updateFields.username = username.trim();
    if (phonenumber) updateFields.phonenumber = phonenumber;

    await Users.update(updateFields, { where: { email } });
    res.status(200).json({ message: "Profile updated successfully" });
  } catch {
    res.status(500).json({ message: "Please try again later" });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const userData = {
      username: user.username,
      phonenumber: user.phonenumber || "",
      profileImage: user.profileImage || "",
      email: user.email,
      googleLogin : user.googleLogin,
    };
    return res.status(200).json({ message: userData });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Could not show data" });
  }
};

const reset_password = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { email, pr_token } = decoded;
    const record = await Token.findOne({ where: { email } });
    if (
      !record ||
      record.pr_token !== pr_token ||
      new Date() > record.pr_expiry
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    return res.redirect(`${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`);
  } catch (err) {
    return res.status(500).json({ message: "Error verifying email" , err : err.message });
  }
};

const update_password = async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    if (!token) return res.status(400).json({ message: "Invalid or expired token" });
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { email } = decoded;
    const tokenRecord = await Token.findOne({ where: { email } });
    if (!tokenRecord || Date.now() > tokenRecord.pr_expiry) return res.status(400).json({ message: "Invalid or expired token" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Users.update({ password: hashedPassword }, { where: { email } });
    await Token.update({ pr_token: null, pr_expiry: null }, { where: { email } });
    res.status(200).json({ message: "Password updated !" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" , error : error.message });
  }
};

module.exports = {
  addUser,
  authenticateUser,
  updateUser,
  getUserByEmail,
  reset_password,
  update_password,
};
