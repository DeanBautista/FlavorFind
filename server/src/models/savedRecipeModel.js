const mongoose = require("mongoose");
const { Schema } = mongoose;

const savedRecipeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent a user from saving the same recipe more than once
savedRecipeSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model("SavedRecipe", savedRecipeSchema);