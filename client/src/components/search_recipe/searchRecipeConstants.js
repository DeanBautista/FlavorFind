export const CATEGORIES = [
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

export const SELECTABLE_CATEGORIES = CATEGORIES.filter((category) => category.label !== "All");

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "quickest", label: "Quickest" },
  { value: "az", label: "A-Z" },
];

export const MAX_COOK_TIME_CEILING = 120;
export const RESULTS_PER_PAGE = 12;
