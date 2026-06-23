import { Calendar, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

export default function ProfileReviewCard({ review }) {
  const navigate = useNavigate();

  const recipeId = review.recipe?._id || review.recipe;
  const recipeName = review.recipe?.title || review.recipe?.name || "Unknown Recipe";
  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-CA")
    : "";

  return (
    <div
      onClick={() => recipeId && navigate(`/recipe/${recipeId}`)}
      className={`rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm space-y-2 transition-all duration-150 ${
        recipeId
          ? "cursor-pointer hover:shadow-md hover:border-orange-200 hover:bg-orange-50/30 active:scale-[0.99]"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <Utensils className="w-4 h-4 text-stone-500 flex-shrink-0" />
        <span className="font-semibold text-stone-900 truncate">{recipeName}</span>
        <StarRating rating={review.rating} />
      </div>

      {review.comment && (
        <p className="text-sm text-stone-600 italic leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}

      {dateStr && (
        <p className="flex items-center gap-1.5 text-xs text-stone-400">
          <Calendar className="w-3.5 h-3.5" />
          {dateStr}
        </p>
      )}
    </div>
  );
}
