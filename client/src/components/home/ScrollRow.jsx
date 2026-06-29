import { useState, useRef, useCallback, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import SkeletonCard from "../SkeletonCard";

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

// All breakpoints: horizontal scroll row, cards at 260px wide.
// Prev/Next buttons float over the left/right edges when overflow exists.
export default function ScrollRow({ recipes, loading, skeletonCount = 4 }) {
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
    <div className="relative animate-fade-in-up">
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