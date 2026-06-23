const express = require("express");
const reviewRouter = express.Router();
const { getReviews, createReview, deleteReview } = require("../controllers/reviewController");
const { protect } = require('../middleware/authMiddleware'); // adjust path if you already have your own

reviewRouter.get("/", protect, getReviews);
reviewRouter.post("/", protect, createReview);
reviewRouter.delete("/:id", protect, deleteReview);

module.exports = reviewRouter;