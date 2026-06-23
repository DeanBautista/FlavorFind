import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../api/recipeApi";

import AuthorCard from "../components/recipe_page/AuthorCard";
import Hero from "../components/recipe_page/Hero";
import IngredientsCard from "../components/recipe_page/IngredientsCard";
import Instructions from "../components/recipe_page/Instructions";
import Nutrition from "../components/recipe_page/Nutrition";
import QuickInfoBar from "../components/recipe_page/QuickInfoBar";
import ReviewsSection from "../components/recipe_page/ReviewSection";
import Header from "../components/header/Header";

export default function RecipePage() {
  const { id } = useParams(); // expects route like /recipes/:id
  const [isNarrow, setIsNarrow] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth <= 1000);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipeById(id);
        if (isMounted) setRecipe(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load recipe.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchRecipe();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Recipe not found.</p>
      </div>
    );
  }

  return (
    <>
      <Header></Header>
      <div className="min-h-screen bg-gray-50">
        <Hero title={recipe.title} image={recipe.image} />

        <div className="max-w-[1232px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in-up">
          {isNarrow ? (
            <div className="flex flex-col gap-4">
              <QuickInfoBar
                prepTime={recipe.prepTime}
                cookTime={recipe.cookTime}
                servings={recipe.servings}
                difficulty={recipe.difficulty}
                categories={recipe.categories}
              />
              <AuthorCard
                author={recipe.author}
                recipeId={recipe._id}
                initialLikes={recipe.likes || []}
                initialSaved={recipe.isSaved}
              />
              <Nutrition nutrition={recipe.nutrition} />
              <IngredientsCard ingredients={recipe.ingredients} stacked />
              <Instructions steps={recipe.steps} />
              <ReviewsSection recipeId={recipe._id} />
            </div>
          ) : (
            <div className="flex flex-row gap-6 items-start">
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <QuickInfoBar
                  prepTime={recipe.prepTime}
                  cookTime={recipe.cookTime}
                  servings={recipe.servings}
                  difficulty={recipe.difficulty}
                  categories={recipe.categories}
                />
                <AuthorCard
                  author={recipe.author}
                  recipeId={recipe._id}
                  initialLikes={recipe.likes || []}
                  initialSaved={recipe.isSaved}
                />
                <Nutrition nutrition={recipe.nutrition} />
                <Instructions steps={recipe.steps} />
                <ReviewsSection recipeId={recipe._id} />
              </div>
              <div className="w-[340px] flex-shrink-0 sticky top-[88px] self-start">
                <IngredientsCard ingredients={recipe.ingredients} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}