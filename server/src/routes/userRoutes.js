const express = require("express");
const router = express.Router();
const { createUser, loginUser, refreshToken, logoutUser, updateUser, getMe, getPublicUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser); 
router.put("/:id", protect, updateUser); 
router.get("/profile/:id", protect, getPublicUser);
router.get("/me", protect, getMe);

module.exports = router;