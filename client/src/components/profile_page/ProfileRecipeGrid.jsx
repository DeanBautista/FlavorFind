import RecipeCard from "../home/RecipeCard";
import { formatRecipeForCard } from "../../utils/recipeSelectors";

export default function ProfileRecipeGrid({ recipes, isOwner = false, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 animate-fade-in-up">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={formatRecipeForCard(recipe)}
          isOwner={isOwner}
          onDelete={isOwner ? onDelete : undefined}
        />
      ))}
    </div>
  );
}