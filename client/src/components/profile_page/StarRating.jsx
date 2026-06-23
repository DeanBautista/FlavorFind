import { Star } from "lucide-react";

export default function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.round(rating)
              ? "fill-orange-400 text-orange-400"
              : "fill-stone-200 text-stone-200"
          }`}
        />
      ))}
    </div>
  );
}
