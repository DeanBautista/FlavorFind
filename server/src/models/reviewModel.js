const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true, // creates createdAt and updatedAt
  }
);

// Prevent a user from reviewing the same recipe multiple times
reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);