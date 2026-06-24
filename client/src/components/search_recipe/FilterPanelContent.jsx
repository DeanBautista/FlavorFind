import Checkbox from "./Checkbox";
import { ChevronDownIcon } from "../../assets/icons/Icons";
import {
  DIFFICULTIES,
  MAX_COOK_TIME_CEILING,
  SELECTABLE_CATEGORIES,
  SORT_OPTIONS,
} from "./searchRecipeConstants";

export default function FilterPanelContent({
  filters,
  onToggleCategory,
  onToggleDifficulty,
  onMaxTimeChange,
  onSortChange,
  onClearAll,
}) {
  return (
    <>
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2.5">Category</h3>
        <div className="flex flex-col">
          <Checkbox
            label="📋 All"
            checked={filters.categories.length === 0}
            onChange={() => onToggleCategory("All")}
          />
          {SELECTABLE_CATEGORIES.map((category) => (
            <Checkbox
              key={category.label}
              label={`${category.icon} ${category.label}`}
              checked={filters.categories.includes(category.label)}
              onChange={() => onToggleCategory(category.label)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2.5">Difficulty</h3>
        <div className="flex flex-col">
          {DIFFICULTIES.map((difficulty) => (
            <Checkbox
              key={difficulty}
              label={difficulty}
              checked={filters.difficulties.includes(difficulty)}
              onChange={() => onToggleDifficulty(difficulty)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Max Cook Time</h3>
        <p className="text-sm text-gray-500 mb-2.5">&le; {filters.maxTime} min</p>
        <input
          type="range"
          min="0"
          max={MAX_COOK_TIME_CEILING}
          value={filters.maxTime}
          onChange={(event) => onMaxTimeChange(Number(event.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-orange-500 accent-orange-500 cursor-pointer"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2.5">Sort by</h3>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2.5 text-[15px] text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      <button
        onClick={onClearAll}
        className="mt-6 w-full rounded-full border border-gray-300 bg-white py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Clear all filters
      </button>
    </>
  );
}
