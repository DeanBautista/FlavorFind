import { FiltersIcon, SearchIcon } from "./SearchRecipeIcons";

export default function SearchHeader({ search, onSearchChange, searchInputRef, onOpenFilters }) {
  return (
    <header className="border-b border-gray-200 bg-[#f7f6f3]">
      <div className="max-w-[1352px] mx-auto px-6 sm:px-8 py-5">
        <div className="flex w-full max-w-2xl mx-auto items-center rounded-full bg-white border border-gray-200 shadow-sm overflow-hidden pl-5">
          <SearchIcon className="h-[18px] w-[18px] text-gray-400 shrink-0 hidden" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search for recipes, ingredients, or cuisines..."
            className="flex-1 min-w-0 py-3 px-0 text-[15px] text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            ref={searchInputRef}
          />
          <button
            onClick={() => searchInputRef.current?.focus()}
            className="m-1.5 shrink-0 inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors text-white text-[15px] font-medium px-5 py-2.5"
          >
            <SearchIcon className="h-4 w-4" />
            Search
          </button>
        </div>

        <button
          onClick={onOpenFilters}
          className="hidden max-[850px]:flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors text-white text-[15px] font-medium py-3 mt-4"
        >
          <FiltersIcon className="h-[18px] w-[18px]" />
          Filters &amp; Sort
        </button>
      </div>
    </header>
  );
}
