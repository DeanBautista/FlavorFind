// Utilities for deriving "Featured" and "Recently Added" lists from a flat
// array of recipes returned by GET /api/recipes.

/**
 * Picks `count` recipes using weighted-random selection, where weight = number of likes.
 * More likes = higher chance of being picked and picked early, but it's never a guaranteed
 * deterministic "top N by likes" — every reload can produce a different order/lineup.
 *
 * Recipes with 0 likes still get a small base weight so a brand-new recipe isn't
 * mathematically impossible to feature.
 */
export function pickFeaturedRecipes(recipes, count = 3) {
  if (!recipes || recipes.length === 0) return [];

  const pool = recipes.map((r) => ({
    recipe: r,
    weight: (r.likes?.length || 0) + 1, // +1 base weight so 0-like recipes can still appear
  }));

  const picked = [];
  const remaining = [...pool];

  while (picked.length < count && remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;

    let index = 0;
    for (let i = 0; i < remaining.length; i++) {
      rand -= remaining[i].weight;
      if (rand <= 0) {
        index = i;
        break;
      }
    }

    picked.push(remaining[index].recipe);
    remaining.splice(index, 1); // don't pick the same recipe twice
  }

  return picked;
}

/**
 * Returns the `count` most recently created recipes, excluding any already
 * shown in featured so the two sections don't duplicate.
 */
export function pickRecentRecipes(recipes, count = 3, excludeIds = []) {
  if (!recipes || recipes.length === 0) return [];

  const excludeSet = new Set(excludeIds);

  return [...recipes]
    .filter((r) => !excludeSet.has(r._id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, count);
}

/**
 * Maps a raw recipe doc (from the API) into the shape RecipeCard expects.
 * Centralizing this means RecipeCard doesn't need to know about Mongo field names.
 */
export function formatRecipeForCard(recipe) {
  const username = recipe.author?.username || 'Unknown';
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return {
    id: recipe._id,
    title: recipe.title,
    time: `${(recipe.prepTime || 0) + (recipe.cookTime || 0)} min`,
    difficulty: recipe.difficulty || 'Medium',
    difficultyColor:
      recipe.difficulty === 'Easy'
        ? 'bg-green-100 text-green-700'
        : recipe.difficulty === 'Hard'
        ? 'bg-red-100 text-red-700'
        : 'bg-amber-100 text-amber-700',
    author: username,                       // now it's the username
    authorInitials: initials,
    avatarUrl: recipe.author?.avatar || '', // ✅ actual avatar URL
    avatarBg: 'bg-orange-200',
    likes: (recipe.likes?.length || 0).toLocaleString(),
    imageUrl: recipe.image || '',
  };
}