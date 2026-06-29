import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRecipes } from "../api/recipeApi";
import FilterSidebar from "../components/search_recipe/FilterSidebar";
import MobileFilterDrawer from "../components/search_recipe/MobileFilterDrawer";
import RecipeResults from "../components/search_recipe/RecipeResults";
import ResultsHeader from "../components/search_recipe/ResultsHeader";
import SearchHeader from "../components/search_recipe/SearchHeader";
import { filtersToParams, readFiltersFromParams } from "../components/search_recipe/filterParams";
import {
  MAX_COOK_TIME_CEILING,
  RESULTS_PER_PAGE,
} from "../components/search_recipe/searchRecipeConstants";
import { useDebounce } from "../hooks/useDebounce";
import Footer from "../components/Footer";

export default function SearchRecipe({ currentUserId }) {
  const navigate = useNavigate();
  const searchInputRef = useRef();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters = useMemo(() => readFiltersFromParams(searchParams), [searchParams]);

  const [search, setSearch] = useState(urlFilters.search);
  const [categories, setCategories] = useState(urlFilters.categories);
  const [difficulties, setDifficulties] = useState(urlFilters.difficulties);
  const [maxTime, setMaxTime] = useState(urlFilters.maxTime);
  const [sort, setSort] = useState(urlFilters.sort);

  const lastPushedRef = useRef(searchParams.toString());
  useEffect(() => {
    const current = searchParams.toString();
    if (current === lastPushedRef.current) return;

    lastPushedRef.current = current;
    const next = readFiltersFromParams(searchParams);
    setSearch(next.search);
    setCategories(next.categories);
    setDifficulties(next.difficulties);
    setMaxTime(next.maxTime);
    setSort(next.sort);
  }, [searchParams]);

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const next = filtersToParams({
      search: debouncedSearch,
      categories,
      difficulties,
      maxTime,
      sort,
    });
    const nextString = new URLSearchParams(next).toString();
    if (nextString === searchParams.toString()) return;

    lastPushedRef.current = nextString;
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, categories, difficulties, maxTime, sort]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      category: categories.length > 0 ? categories.join(",") : undefined,
      difficulty: difficulties.length > 0 ? difficulties.join(",") : undefined,
      maxTime: maxTime < MAX_COOK_TIME_CEILING ? maxTime : undefined,
      sort,
      limit: RESULTS_PER_PAGE,
      page: 1,
    }),
    [debouncedSearch, categories, difficulties, maxTime, sort]
  );

  const requestIdRef = useRef(0);

  useEffect(() => {
    const thisRequestId = ++requestIdRef.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    getRecipes(queryParams)
      .then((data) => {
        if (thisRequestId !== requestIdRef.current) return;

        const list = Array.isArray(data) ? data : data.recipes;
        const totalCount = Array.isArray(data) ? data.length : data.total;

        const withLikeFlags = list.map((recipe) => ({
          ...recipe,
          likesCount: recipe.likes?.length ?? 0,
          likedByMe: currentUserId
            ? (recipe.likes || []).some((likeId) =>
                typeof likeId === "string" ? likeId === currentUserId : likeId?._id === currentUserId
              )
            : false,
        }));

        setRecipes(withLikeFlags);
        setTotal(totalCount ?? withLikeFlags.length);
      })
      .catch((err) => {
        if (thisRequestId !== requestIdRef.current) return;
        setError(err.message || "Failed to load recipes.");
        setRecipes([]);
        setTotal(0);
      })
      .finally(() => {
        if (thisRequestId !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [queryParams, currentUserId]);

  const toggleCategory = useCallback((category) => {
    if (category === "All") {
      setCategories([]);
      return;
    }

    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  }, []);

  const toggleDifficulty = useCallback((difficulty) => {
    setDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((item) => item !== difficulty)
        : [...prev, difficulty]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setCategories([]);
    setDifficulties([]);
    setMaxTime(MAX_COOK_TIME_CEILING);
    setSort("newest");
  }, []);

  const hasActiveFilters =
    search.trim() !== "" ||
    categories.length > 0 ||
    difficulties.length > 0 ||
    maxTime < MAX_COOK_TIME_CEILING;

  const filterPanelProps = {
    filters: { categories, difficulties, maxTime, sort },
    onToggleCategory: toggleCategory,
    onToggleDifficulty: toggleDifficulty,
    onMaxTimeChange: setMaxTime,
    onSortChange: setSort,
    onClearAll: clearAllFilters,
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <SearchHeader
        search={search}
        onSearchChange={setSearch}
        searchInputRef={searchInputRef}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <div className="max-w-[1352px] mx-auto px-6 sm:px-8 py-8 flex gap-8 items-start animate-fade-in-up">
        <FilterSidebar filterPanelProps={filterPanelProps} />

        <main className="flex-1 min-w-0">
          <ResultsHeader
            loading={loading}
            error={error}
            search={search}
            recipesCount={recipes.length}
            total={total}
            sort={sort}
            onSortChange={setSort}
            onBackHome={() => navigate("/home")}
          />

          {hasActiveFilters ? (
            <button
              onClick={clearAllFilters}
              className="text-[15px] text-orange-600 mb-5 hover:underline"
            >
              Clear active filters
            </button>
          ) : (
            <p className="text-[15px] text-orange-600 mb-5">No active filters</p>
          )}

          <RecipeResults loading={loading} error={error} recipes={recipes} />
        </main>
      </div>

      <MobileFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filterPanelProps={filterPanelProps}
      />

      <Footer />
    </div>
  );
}
