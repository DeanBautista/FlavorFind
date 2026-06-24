import { ChevronDownIcon, CloseIcon } from "../../assets/icons/Icons";
import { SORT_OPTIONS } from "./searchRecipeConstants";

export default function ResultsHeader({ loading, error, search, recipesCount, total, sort, onSortChange, onBackHome }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-1">
      <p className="text-[15px] text-gray-500">
        {loading
          ? "Searching..."
          : error
          ? "Couldn't load results"
          : search.trim()
          ? (
              <>
                Showing {recipesCount} of {total} results for <span className="italic">'{search.trim()}'</span>
              </>
            )
          : (
              <>
                Showing {recipesCount} of {total} results
              </>
            )}
      </p>

      <div className="max-[850px]:hidden flex items-center gap-2 shrink-0">
        <span className="text-[15px] text-gray-500">Sort:</span>
        <div className="relative">
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="appearance-none rounded-full border border-gray-300 bg-white pl-4 pr-9 py-1.5 text-[15px] text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
        </div>
        <button onClick={onBackHome} aria-label="Back to home">
          <CloseIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
