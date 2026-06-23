import { MAX_COOK_TIME_CEILING } from "./searchRecipeConstants";

export function readFiltersFromParams(params) {
  const categoryParam = params.get("category");
  const difficultyParam = params.get("difficulty");
  const maxTimeParam = params.get("maxTime");
  const sortParam = params.get("sort");

  return {
    search: params.get("q") || "",
    categories: categoryParam ? categoryParam.split(",").filter(Boolean) : [],
    difficulties: difficultyParam ? difficultyParam.split(",").filter(Boolean) : [],
    maxTime: maxTimeParam ? Number(maxTimeParam) : MAX_COOK_TIME_CEILING,
    sort: sortParam || "newest",
  };
}

export function filtersToParams({ search, categories, difficulties, maxTime, sort }) {
  const next = {};
  if (search.trim()) next.q = search.trim();
  if (categories.length > 0) next.category = categories.join(",");
  if (difficulties.length > 0) next.difficulty = difficulties.join(",");
  if (maxTime < MAX_COOK_TIME_CEILING) next.maxTime = String(maxTime);
  if (sort !== "newest") next.sort = sort;
  return next;
}
