const express = require('express');
const router = express.Router();
const { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, toggleLike, toggleSaveRecipe, getSavedRecipes  } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware'); // adjust path if you already have your own

// GET /api/recipes — public, used by the homepage to build Featured/Recently Added
router.get('/', protect, getAllRecipes);

// POST /api/recipes — requires auth, creates a recipe owned by the logged-in user
router.post('/', protect, createRecipe);

router.get('/saved-recipes', protect, getSavedRecipes);

router.get('/:id', protect, getRecipeById);

// PUT /api/recipes/:id — requires auth, only the recipe's author may update it
// (ownership check lives in the updateRecipe controller)
router.put('/:id', protect, updateRecipe);

router.post('/:id/like', protect, toggleLike);

// recipeRoutes.js
router.post('/:id/save', protect, toggleSaveRecipe);

router.delete('/:id', protect, deleteRecipe);

module.exports = router;