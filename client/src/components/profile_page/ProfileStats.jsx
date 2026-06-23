export default function ProfileStats({ recipesCount, totalLikes, reviewsCount }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-6 grid grid-cols-3 divide-x divide-stone-100">
      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-bold text-stone-900">{recipesCount}</p>
        <p className="text-xs uppercase tracking-wide text-stone-400 mt-1">Recipes</p>
      </div>
      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-bold text-stone-900">
          {totalLikes.toLocaleString()}
        </p>
        <p className="text-xs uppercase tracking-wide text-stone-400 mt-1">Total Likes</p>
      </div>
      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-bold text-stone-900">{reviewsCount}</p>
        <p className="text-xs uppercase tracking-wide text-stone-400 mt-1">Reviews</p>
      </div>
    </div>
  );
}
