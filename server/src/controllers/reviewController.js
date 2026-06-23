const Review = require("../models/reviewModel");

// GET /api/reviews?recipe=:id  OR  ?user=:id
exports.getReviews = async (req, res) => {
  try {
    const { recipe, user } = req.query;
    if (!recipe && !user)
      return res.status(400).json({ message: "recipe or user id is required." });

    const filter = recipe ? { recipe } : { user };

    const reviews = await Review.find(filter)
      .populate("user", "username avatar")
      .populate("recipe", "title")   // ← needed so ReviewCard can show the name
      .sort({ createdAt: -1 })
      .lean();

    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.status(200).json({ reviews, avg, total: reviews.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { recipe, rating, comment } = req.body;

    const review = await Review.create({
      recipe,
      user: req.user._id,
      rating,
      comment,
    });

    await review.populate("user", "username avatar");

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You've already reviewed this recipe." });
    }
    res.status(500).json({ message: "Failed to submit review." });
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review." });
  }
};