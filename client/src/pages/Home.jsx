import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import RecipeCard from "../components/home/RecipeCard";
import { getRecipes } from "../api/recipeApi";
import {
  pickFeaturedRecipes,
  pickRecentRecipes,
  formatRecipeForCard,
} from "../utils/recipeSelectors";

const categories = [
  { label: "All", icon: "📋" },
  { label: "Breakfast", icon: "🥞" },
  { label: "Lunch", icon: "🍽️" },
  { label: "Dinner", icon: "🌙" },
  { label: "Dessert", icon: "🎂" },
  { label: "Vegan", icon: "🌿" },
  { label: "Quick", icon: "⚡" },
  { label: "Italian", icon: "🍕" },
  { label: "Healthy", icon: "🍎" },
];

const SECTION_LIMIT = 10;

// ─── Nav arrow button ──────────────────────────────────────────────────────
function NavBtn({ direction, onClick, visible }) {
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Scroll left" : "Scroll right"}
      className="
        absolute top-1/2 -translate-y-1/2 z-10
        w-9 h-9 flex items-center justify-center
        bg-white border border-gray-200 rounded-full shadow-md
        text-gray-600 hover:text-orange-500 hover:border-orange-300
        transition-all duration-150 active:scale-95
      "
      style={{ [direction === "prev" ? "left" : "right"]: "-18px" }}
    >
      {direction === "prev" ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

// ─── Shared scroll row ─────────────────────────────────────────────────────
// All breakpoints: horizontal scroll row, cards at 260px wide.
// Prev/Next buttons float over the left/right edges when overflow exists.
function ScrollRow({ recipes, loading, skeletonCount = 4 }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const overflowed = el.scrollWidth > el.clientWidth + 1;
    setCanPrev(overflowed && el.scrollLeft > 4);
    setCanNext(overflowed && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // Run after layout so scrollWidth is accurate
    const ro = new ResizeObserver(syncButtons);
    ro.observe(el);
    el.addEventListener("scroll", syncButtons, { passive: true });
    syncButtons();
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", syncButtons);
    };
  }, [recipes, syncButtons]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // Mobile/tablet (< 1024px): scroll one card width (260px + 16px gap)
    // Desktop: scroll a full visible page
    const amount = window.innerWidth < 1024 ? 276 : el.clientWidth;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="flex gap-4 overflow-hidden pb-2">
          {[...Array(skeletonCount)].map((_, i) => (
            <SkeletonCard key={i} className="flex-none w-[260px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <NavBtn direction="prev" onClick={() => scroll("prev")} visible={canPrev} />

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {recipes.map((recipe) => (
          <div key={recipe.id ?? recipe._id} className="flex-none w-[260px]">
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>

      <NavBtn direction="next" onClick={() => scroll("next")} visible={canNext} />
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function SkeletonCard({ className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse ${className}`}>
      <div className="w-full bg-gray-100" style={{ paddingBottom: "62%" }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full" />
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center text-sm text-gray-400 bg-white border border-gray-100 rounded-2xl py-10">
      {message}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchRecipes() {
      try {
        setLoading(true);
        const data = await getRecipes();
        if (isMounted) { setRecipes(data); setError(null); }
      } catch (err) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchRecipes();
    return () => { isMounted = false; };
  }, []);

  const browseRecipes = useMemo(() => {
    const base =
      activeCategory === "All"
        ? recipes
        : recipes.filter((r) => r.categories?.includes(activeCategory));
    return base.slice(0, SECTION_LIMIT).map(formatRecipeForCard);
  }, [recipes, activeCategory]);

  const featured = useMemo(
    () => pickFeaturedRecipes(recipes, SECTION_LIMIT).map(formatRecipeForCard),
    [recipes]
  );
  const recent = useMemo(
    () => pickRecentRecipes(recipes, SECTION_LIMIT, []).map(formatRecipeForCard),
    [recipes]
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#faf7f2] font-sans">

        {/* ── Hero ── */}
        <div className="w-full relative overflow-hidden" style={{ height: "420px" }}>
          <img
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1400&q=80"
            alt="Food spread"
            className="animate-ken-burns absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />
          <div
            className="animate-title-reveal absolute inset-0 flex flex-col justify-center px-8 lg:px-16"
            style={{ maxWidth: "1280px", margin: "0 auto", left: 0, right: 0 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white uppercase tracking-widest mb-3 bg-orange-500 px-3 py-1 rounded-full w-fit">
              ✦ Welcome to flavorfind
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={{ maxWidth: "600px" }}>
              Discover & share recipes you'll love
            </h1>
            <p className="text-white/70 text-base mb-6" style={{ maxWidth: "480px" }}>
              A home for home cooks — browse thousands of recipes, save your
              favorites, and share your own creations with a community that loves
              food as much as you do.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/search")}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-semibold rounded-full"
              >
                Browse Recipes
              </button>
              <button
                onClick={() => navigate("/addrecipe")}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-semibold rounded-full border border-white/30"
              >
                + Share a Recipe
              </button>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="animate-fade-in-up mx-auto px-7 pt-3 pb-8 w-full" style={{ maxWidth: "1280px" }}>

          {/* ── Category pills ── */}
          <div className="w-full border-b border-gray-100 bg-[#faf7f2] sticky top-0 z-10 mb-7">
            <div
              className="flex flex-row gap-2 px-4 py-3 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors duration-150 font-medium
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
          </div>

          {error && (
            <div className="mb-8 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              Couldn't load recipes: {error}
            </div>
          )}

          {/* ── Browse (filtered) ── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>🔍</span>
                {activeCategory === "All" ? "Browse Recipes" : `${activeCategory} Recipes`}
              </h2>
              <button
                onClick={() => navigate(activeCategory === "All" ? "/search" : `/search?category=${encodeURIComponent(activeCategory)}`)}
                className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                See all →
              </button>
            </div>

            {!loading && browseRecipes.length === 0 ? (
              <EmptyState
                message={activeCategory === "All"
                  ? "No recipes yet — be the first to share one!"
                  : `No ${activeCategory} recipes yet. Be the first to add one!`
                }
              />
            ) : (
              <>
                <ScrollRow recipes={browseRecipes} loading={loading} skeletonCount={4} />
                {!loading && browseRecipes.length === SECTION_LIMIT && (
                  <div className="mt-5 text-center">
                    <button
                      onClick={() => navigate(activeCategory === "All" ? "/search" : `/search?category=${encodeURIComponent(activeCategory)}`)}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-orange-500 border border-orange-200 rounded-full hover:bg-orange-50 transition-colors"
                    >
                      View all results →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* ── Featured (unfiltered) ── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>✦</span> Featured Recipes
              </h2>
              <span className="text-sm text-gray-400 hidden sm:block">Handpicked by our chefs</span>
            </div>
            {!loading && featured.length === 0 ? (
              <EmptyState message="No recipes yet — be the first to share one!" />
            ) : (
              <ScrollRow recipes={featured} loading={loading} skeletonCount={3} />
            )}
          </section>

          {/* ── Recently Added (unfiltered) ── */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Recently Added
              </h2>
              <span className="text-sm text-gray-400 hidden sm:block">Fresh from the kitchen</span>
            </div>
            {!loading && recent.length === 0 ? (
              <EmptyState message="Nothing new at the moment — check back soon." />
            ) : (
              <ScrollRow recipes={recent} loading={loading} skeletonCount={3} />
            )}
          </section>

        </main>
      </div>
    </>
  );
}