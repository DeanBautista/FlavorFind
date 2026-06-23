import { useNavigate } from "react-router-dom";

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
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{recipe.title}</h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
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
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span className="text-gray-400">{recipe.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}