const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 200 },

    // Frontend uses a multi-select checkbox list, so this is an array.
    // Swap to `{ type: String }` if you want to restrict to one category.
    categories: {
      type: [String],
      required: true,
      validate: (arr) => Array.isArray(arr) && arr.length > 0,
    },

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },

    prepTime: { type: Number, default: 0 },
    cookTime: { type: Number, required: true },
    servings: { type: Number, default: 1 },

    // Plain URL string for now — wire up multer/cloud storage later
    // if you want real file uploads instead of a hosted image URL.
    image: { type: String, default: '' },

    ingredients: [
      {
        amount: { type: String, default: '' },
        unit: { type: String, default: '' },
        name: { type: String, required: true },
      },
    ],

    steps: [
      {
        stepNumber: { type: Number, required: true },
        instruction: { type: String, required: true },
      },
    ],

    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  },
  { timestamps: true } // gives you createdAt / updatedAt automatically
);

module.exports = mongoose.model('Recipe', recipeSchema);