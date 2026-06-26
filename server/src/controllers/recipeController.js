const mongoose = require('mongoose');
const Recipe = require('../models/recipeModel');
const User = require('../models/userModel')
const Review = require('../models/reviewModel');
const SavedRecipe = require('../models/savedRecipeModel');

// POST /api/recipes
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      categories,
      difficulty,
      prepTime,
      cookTime,
      servings,
      image,
      ingredients,
      instructions, // flat array of strings, or [{ text }] from the form state
      calories,
      protein,
      carbs,
      fat,
    } = req.body;

    // --- Validation mirrors the "required" labels on the form ---
    if (!title || !description || !cookTime) {
      return res
        .status(400)
        .json({ message: 'Title, description and cook time are required.' });
    }
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Select at least one category.' });
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Add at least one ingredient.' });
    }
    if (!Array.isArray(instructions) || instructions.length === 0) {
      return res.status(400).json({ message: 'Add at least one instruction step.' });
    }

    // Normalize instructions, whether they arrive as plain strings
    // or as { text } objects (which is what AddRecipe.jsx currently sends).
    const steps = instructions
      .map((item) => (typeof item === 'string' ? item : item.text))
      .filter((text) => text && text.trim() !== '')
      .map((text, index) => ({ stepNumber: index + 1, instruction: text }));

    if (steps.length === 0) {
      return res.status(400).json({ message: 'Instructions cannot be empty.' });
    }

    const recipe = await Recipe.create({
      title,
      description,
      categories,
      difficulty,
      prepTime: prepTime || 0,
      cookTime,
      servings: servings || 1,
      image: image || '',
      ingredients,
      steps,
      nutrition: { calories, protein, carbs, fat },
      author: req.user._id, // populated by the auth middleware
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create recipe', error: error.message });
  }
};

// GET /api/recipes
// Supports filtering + sorting via query params so the search page can hit
// this single endpoint instead of fetching everything and filtering client-side:
//
//   ?search=quesadilla        title/description text match (case-insensitive)
//   ?category=Vegan           single category
//   ?category=Vegan,Dinner    multiple categories (comma-separated, OR'd together)
//   ?difficulty=Easy          exact match against the enum
//   ?maxTime=30               cookTime <= 30 (minutes)
//   ?sort=newest              newest (default) | popular | quickest | az
//   ?page=1&limit=12          pagination
//
// All params are optional; calling GET /api/recipes with none of them
// reproduces the old "return everything" behavior so existing callers
// (e.g. the homepage Featured/Recently Added sections) keep working.
const getAllRecipes = async (req, res) => {
  try {
    const {
      search,
      category,
      difficulty,
      author,
      likedBy,
      maxTime,
      sort,
      page = 1,
      limit,
    } = req.query;

    const filter = {};

    if (search && search.trim() !== '') {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    if (category && category.trim() !== '') {
      const categoryList = category
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (categoryList.length > 0) {
        filter.categories = { $in: categoryList };
      }
    }

    if (difficulty && difficulty.trim() !== '') {
      const difficultyList = difficulty
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      if (difficultyList.length === 1) {
        filter.difficulty = difficultyList[0];
      } else if (difficultyList.length > 1) {
        filter.difficulty = { $in: difficultyList };
      }
    }

    if (author && author.trim() !== '') {
      if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({ message: 'Invalid author id.' });
      }
      filter.author = author;
    }

    if (likedBy && likedBy.trim() !== '') {
      if (!mongoose.Types.ObjectId.isValid(likedBy)) {
        return res.status(400).json({ message: 'Invalid likedBy id.' });
      }
      filter.likes = new mongoose.Types.ObjectId(likedBy);
    }

    if (maxTime !== undefined && maxTime !== '') {
      const maxTimeNum = Number(maxTime);
      if (!Number.isNaN(maxTimeNum)) {
        filter.cookTime = { $lte: maxTimeNum };
      }
    }

    let sortStage;
    switch (sort) {
      case 'popular':
        sortStage = null;
        break;
      case 'quickest':
        sortStage = { cookTime: 1 };
        break;
      case 'az':
        sortStage = { title: 1 };
        break;
      case 'newest':
      default:
        sortStage = { createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = limit ? Math.max(1, Number(limit) || 12) : null;
    const skip = limitNum ? (pageNum - 1) * limitNum : 0;

    let recipes;
    let total;

    if (sort === 'popular') {
      const pipeline = [
        { $match: filter },
        { $addFields: { likesCount: { $size: { $ifNull: ['$likes', []] } } } },
        { $sort: { likesCount: -1, createdAt: -1 } },
      ];

      total = (await Recipe.aggregate([...pipeline, { $count: 'count' }]))[0]?.count || 0;

      if (limitNum) {
        pipeline.push({ $skip: skip }, { $limit: limitNum });
      }

      recipes = await Recipe.aggregate(pipeline);
      recipes = await Recipe.populate(recipes, { path: 'author', select: 'username avatar' });
    } else {
      total = await Recipe.countDocuments(filter);

      let query = Recipe.find(filter)
        .populate('author', 'username avatar')
        .sort(sortStage)
        .lean();

      if (limitNum) {
        query = query.skip(skip).limit(limitNum);
      }

      recipes = await query;
    }

    if (!limitNum) {
      return res.status(200).json(recipes);
    }

    res.status(200).json({
      recipes,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

// GET /api/recipes/:id
// Returns a single recipe with its author populated.
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Guard against invalid ObjectId format before hitting the DB,
    // otherwise Mongoose throws a CastError that's annoying to distinguish
    // from a genuine "not found".
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid recipe id.' });
    }

    const recipe = await Recipe.findById(id)
      .populate('author', 'username avatar bio')
      .lean();

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    if (req.user) {
      const savedDoc = await SavedRecipe.findOne({
        user: req.user._id,
        recipe: id,
      }).lean();
      recipe.isSaved = !!savedDoc;
    } else {
      recipe.isSaved = false;
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Failed to fetch recipe' });
  }
};

const toggleLike = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id; // assumes auth middleware sets req.user

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const alreadyLiked = recipe.likes.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (alreadyLiked) {
      recipe.likes = recipe.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      recipe.likes.push(userId);
    }

    await recipe.save();

    return res.status(200).json({
      liked: !alreadyLiked,
      likesCount: recipe.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/recipes/:id/save
// Toggles a save (bookmark) for the logged-in user on the given recipe.
const toggleSaveRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id; // set by auth middleware

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: 'Invalid recipe id.' });
    }

    const recipeExists = await Recipe.exists({ _id: recipeId });
    if (!recipeExists) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const existing = await SavedRecipe.findOne({ user: userId, recipe: recipeId });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ saved: false });
    }

    await SavedRecipe.create({ user: userId, recipe: recipeId });
    return res.status(200).json({ saved: true });
  } catch (error) {
    // Guards against a double-click firing two requests at once and
    // hitting the unique index race condition.
    if (error.code === 11000) {
      return res.status(200).json({ saved: true });
    }
    console.error('Error toggling saved recipe:', error);
    res.status(500).json({ message: 'Failed to update saved recipe.' });
  }
};

// GET /api/saved-recipes
// Returns the logged-in user's saved recipes (handy later for a "Saved" tab on the profile page).
const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = limit ? Math.max(1, Number(limit) || 12) : null;
    const skip = limitNum ? (pageNum - 1) * limitNum : 0;

    const filter = { user: userId };
    const total = await SavedRecipe.countDocuments(filter);

    let query = SavedRecipe.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'recipe',
        populate: { path: 'author', select: 'username avatar' },
      })
      .lean();

    if (limitNum) query = query.skip(skip).limit(limitNum);

    const saved = await query;
    const recipes = saved.map((s) => s.recipe).filter(Boolean); // drop any deleted recipes

    if (!limitNum) return res.status(200).json(recipes);

    res.status(200).json({
      recipes,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ message: 'Failed to fetch saved recipes.' });
  }
};

// PUT /api/recipes/:id
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Only the recipe's author can edit it
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You don't have permission to edit this recipe." });
    }

    const {
      title,
      description,
      categories,
      difficulty,
      prepTime,
      cookTime,
      servings,
      image,
      ingredients,
      instructions, // flat array of strings, or [{ text }] from the form state
      calories,
      protein,
      carbs,
      fat,
    } = req.body;

    // --- Validation mirrors createRecipe ---
    if (!title || !description || !cookTime) {
      return res
        .status(400)
        .json({ message: 'Title, description and cook time are required.' });
    }
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Select at least one category.' });
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Add at least one ingredient.' });
    }
    if (!Array.isArray(instructions) || instructions.length === 0) {
      return res.status(400).json({ message: 'Add at least one instruction step.' });
    }

    // Normalize instructions, whether they arrive as plain strings
    // or as { text } objects.
    const steps = instructions
      .map((item) => (typeof item === 'string' ? item : item.text))
      .filter((text) => text && text.trim() !== '')
      .map((text, index) => ({ stepNumber: index + 1, instruction: text }));

    if (steps.length === 0) {
      return res.status(400).json({ message: 'Instructions cannot be empty.' });
    }

    recipe.title = title;
    recipe.description = description;
    recipe.categories = categories;
    recipe.difficulty = difficulty;
    recipe.prepTime = prepTime || 0;
    recipe.cookTime = cookTime;
    recipe.servings = servings || 1;
    recipe.image = image || '';
    recipe.ingredients = ingredients;
    recipe.steps = steps;
    recipe.nutrition = { calories, protein, carbs, fat };

    const updatedRecipe = await recipe.save();

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update recipe', error: error.message });
  }
};

// DELETE /api/recipes/:id
// DELETE /api/recipes/:id
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid recipe id.' });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Only the recipe's author can delete it
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You don't have permission to delete this recipe." });
    }

    await recipe.deleteOne();

    // Clean up everything that references this recipe so nothing orphans:
    // saved-recipe bookmarks and reviews left by other users.
    await Promise.all([
      SavedRecipe.deleteMany({ recipe: id }),
      Review.deleteMany({ recipe: id }),
    ]);

    res.status(200).json({ message: 'Recipe deleted.', id });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Failed to delete recipe.', error: error.message });
  }
};

module.exports = { createRecipe, getAllRecipes, getRecipeById, toggleLike, toggleSaveRecipe, getSavedRecipes, updateRecipe, deleteRecipe };
