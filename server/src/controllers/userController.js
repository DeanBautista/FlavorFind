const mongoose = require('mongoose');
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ── Token Generators ──────────────────────────────────────────
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN, // 15m
  });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, // 7d
  });

// ── Cookie Helper ─────────────────────────────────────────────
const refreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const clearRefreshTokenCookieOptions = () => {
  const { maxAge, ...options } = refreshTokenCookieOptions();
  return options;
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, refreshTokenCookieOptions());
};

// ── Register ──────────────────────────────────────────────────
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);   // ← refresh token in cookie

    res.status(201).json({
      accessToken,                              // ← only access token in body
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `${field} already exists`, inputType: field });
    }
    const field = err.errors ? Object.keys(err.errors)[0] : "password";
    console.error({ createAccountError: err.message });
    res.status(400).json({ message: err.message, inputType: field });
  }
};

// ── Login ─────────────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  console.log("logging in");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email.", inputType: "email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password.", inputType: "password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);   // ← refresh token in cookie

    res.status(200).json({
      accessToken,                              // ← only access token in body
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error({ loginError: err.message });
    res.status(500).json({ message: "Something went wrong. Please try again.", inputType: "password" });
  }
};

// ── Refresh Token ─────────────────────────────────────────────
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate both tokens
    const accessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);  // ← new refresh token

    // Overwrite the old cookie with the new refresh token
    setRefreshTokenCookie(res, newRefreshToken);               // ← replaces old one

    res.status(200).json({ accessToken });
  } catch (err) {
    // Clear the bad cookie so the user isn't stuck in a loop
    res.clearCookie("refreshToken", clearRefreshTokenCookieOptions());
    return res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};

// ── Logout ────────────────────────────────────────────────────
exports.logoutUser = (req, res) => {
  res.clearCookie("refreshToken", clearRefreshTokenCookieOptions());
  res.status(200).json({ message: "Logged out successfully." });
};

// PUT /api/users/:id  →  userController.updateUser
exports.updateUser = async (req, res) => {
  console.log('hey')
  try {
    const { username, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio, avatar },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (err) {
    if (err.code === 11000) {
      console.error({ updateUserError: err.message });
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `${field} already taken.`, inputType: field });
    }
    console.error({ updateUserError: err.message });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// GET /api/users/me  →  userController.getMe
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error({ getMeError: err.message });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

exports.getPublicUser = async (req, res) => {
  try {
    const { id } = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id." });
    }
 
    const user = await User.findById(id)
      .select("username avatar bio createdAt")
      .lean();
 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
 
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching public user:", err);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};