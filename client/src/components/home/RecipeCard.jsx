import { useNavigate } from "react-router-dom";
import { ClockIcon, EditIcon, HeartIcon } from "../../assets/icons/Icons";

export default function RecipeCard({ recipe, isOwner = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!recipe.id) {
      console.warn("RecipeCard: missing recipe id, cannot navigate.", recipe);
      return;
    }
    navigate(`/recipe/${recipe.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (!recipe.id) {
      console.warn("RecipeCard: missing recipe id, cannot navigate to edit.", recipe);
      return;
    }
    navigate(`/recipe/${recipe.id}/edit`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "62%" }}>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.style.background = "#f5ece6";
          }}
        />
        {isOwner && (
          <button
            onClick={handleEditClick}
            aria-label="Edit recipe"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-orange-500 flex items-center justify-center shadow-sm transition-colors duration-150"
          >
            <EditIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{recipe.title}</h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <ClockIcon className="w-3.5 h-3.5" />
            {recipe.time}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${recipe.difficultyColor}`}>
            {recipe.difficulty}
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            {recipe.avatarUrl ? (
              <img
                src={recipe.avatarUrl}
                alt={recipe.author}
                className="w-7 h-7 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-7 h-7 rounded-full ${recipe.avatarBg} items-center justify-center text-xs font-semibold text-gray-700 ${
                recipe.avatarUrl ? "hidden" : "flex"
              }`}
            >
              {recipe.authorInitials}
            </div>
            <span className="text-sm text-gray-600">{recipe.author}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <HeartIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">{recipe.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
