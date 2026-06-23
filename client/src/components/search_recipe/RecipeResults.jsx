import RecipeCard from "../home/RecipeCard";
import { formatRecipeForCard } from "../../utils/recipeSelectors";
import { SpinnerIcon } from "./SearchRecipeIcons";

export default function RecipeResults({ loading, error, recipes }) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-[15px] px-4 py-3 mb-5">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <SpinnerIcon className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-gray-700">No recipes found</p>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 max-[1100px]:grid-cols-2 max-[630px]:grid-cols-1 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={formatRecipeForCard(recipe)} />
      ))}
    </div>
  );
}
