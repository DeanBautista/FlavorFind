// src/pages/CategoriesPage.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/header/Header";
import RecipeCard from "../components/home/RecipeCard";
import { getRecipes } from "../api/recipeApi";
import { formatRecipeForCard } from "../utils/recipeSelectors";

const categories = [
  { label: "All",       icon: "📋" },
  { label: "Breakfast", icon: "🥞" },
  { label: "Lunch",     icon: "🍽️" },
  { label: "Dinner",    icon: "🌙" },
  { label: "Dessert",   icon: "🎂" },
  { label: "Vegan",     icon: "🌿" },
  { label: "Quick",     icon: "⚡" },
  { label: "Italian",   icon: "🍕" },
  { label: "Healthy",   icon: "🍎" },
];

// Fisher-Yates shuffle — returns a new array
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full bg-gray-100" style={{ paddingBottom: "62%" }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

function EmptyState({ category }) {
  return (
    <div className="col-span-full text-center text-sm text-gray-400 bg-white border border-gray-100 rounded-2xl py-12">
      {category === "All"
        ? "No recipes yet — be the first to share one!"
        : `No ${category} recipes yet. Be the first to add one!`}
    </div>
  );
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Allow linking directly to a category: /categories?category=Vegan
  const initialCat = searchParams.get("category") ?? "All";
  const [activeCategory, setActiveCategory] = useState(
    categories.some((c) => c.label === initialCat) ? initialCat : "All"
  );

  const [recipes, setRecipes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [shuffleKey, setShuffleKey] = useState(0); // bump to re-shuffle

  // Fetch once
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getRecipes();
        if (isMounted) { setRecipes(data); setError(null); }
      } catch (err) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Sync URL when category changes
  const handleSelectCategory = useCallback((label) => {
    setActiveCategory(label);
    setShuffleKey((k) => k + 1); // new shuffle on category switch
    setSearchParams(label === "All" ? {} : { category: label });
  }, [setSearchParams]);

  // Filter → shuffle → format. shuffleKey forces a re-shuffle without refetching.
  const displayRecipes = useMemo(() => {
    const filtered =
      activeCategory === "All"
        ? recipes
        : recipes.filter((r) => r.categories?.includes(activeCategory));
    return shuffleArray(filtered).map(formatRecipeForCard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, activeCategory, shuffleKey]);

  const activeMeta = categories.find((c) => c.label === activeCategory);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#faf7f2] font-sans">
        <main className="mx-auto px-7 pt-8 pb-12 w-full animate-fade-in-up" style={{ maxWidth: "1280px" }}>

          {/* Back link */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </button>

          {/* Page heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-400 mt-1">
              Pick a category — recipes are shuffled fresh each time.
            </p>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleSelectCategory(cat.label)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-colors duration-150
                  ${activeCategory === cat.label
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                  }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-8 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              Couldn't load recipes: {error}
            </div>
          )}

          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>{activeMeta?.icon}</span>
              {activeCategory === "All" ? "All Recipes" : `${activeCategory} Recipes`}
              {!loading && (
                <span className="text-sm font-normal text-gray-400">
                  ({displayRecipes.length})
                </span>
              )}
            </h2>

            {/* Shuffle button */}
            {!loading && displayRecipes.length > 0 && (
              <button
                onClick={() => setShuffleKey((k) => k + 1)}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 border border-gray-200 hover:border-orange-300 rounded-full px-3 py-1.5 transition-colors"
              >
                {/* Simple shuffle icon */}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16 3h5v5M4 20L21 3M16 21h5v-5M4 4l5 5" />
                </svg>
                Shuffle
              </button>
            )}
          </div>

          {/* Recipe grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
              : displayRecipes.length === 0
                ? <EmptyState category={activeCategory} />
                : displayRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id ?? recipe._id} recipe={recipe} />
                  ))
            }
          </div>

        </main>
      </div>
    </>
  );
}