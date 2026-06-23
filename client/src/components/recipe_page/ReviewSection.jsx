import { useState, useEffect, useContext } from "react";
import { StarIcon } from "../../assets/icons/Icons";
import { getReviews, createReview, deleteReview } from "../../api/reviewApi";
import { AuthContext } from "../../context/AuthContext"; // adjust path if needed

function RatingStars({ rating, size = "w-5 h-5" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          filled={rating >= i}
          half={rating >= i - 0.5 && rating < i}
          className={size}
        />
      ))}
    </div>
  );
}

function ReviewSummaryBar({ avg, total }) {
  return (
    <div className="bg-orange-50 rounded-2xl px-5 sm:px-6 py-4 flex items-center gap-3">
      <RatingStars rating={avg} />
      <span className="font-bold text-gray-900">{avg > 0 ? avg.toFixed(1) : "—"}</span>
      <span className="text-gray-500">·</span>
      <span className="text-gray-600">{total} {total === 1 ? "review" : "reviews"}</span>
    </div>
  );
}

function ReviewCard({ review, currentUserId, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-6 py-4 sm:py-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img
            src={review.user.avatar || `https://i.pravatar.cc/80?u=${review.user._id}`}
            alt={review.user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{review.user.username}</p>
            <RatingStars rating={review.rating} size="w-4 h-4" />
          </div>
        </div>
        {currentUserId && review.user._id === currentUserId && (
          <button
            onClick={() => onDelete(review._id)}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
      {review.comment && (
        <p className="text-gray-700 leading-relaxed mb-1">{review.comment}</p>
      )}
      <p className="text-gray-400 text-sm">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

function LeaveReview({ onSubmit, submitting, error }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit({ rating: selected, comment });
    setSelected(0);
    setHover(0);
    setComment("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-6 py-5">
      <h3 className="flex items-center gap-2 font-bold text-gray-900 text-base mb-4">
        <span aria-hidden>✍️</span> Leave a review
      </h3>
      <div className="flex items-center gap-1.5 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            type="button"
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setSelected(i)}
            className="text-gray-300 hover:text-orange-400 transition-colors"
            aria-label={`Rate ${i} star`}
          >
            <StarIcon filled={hover ? hover >= i : selected >= i} className="w-7 h-7" />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this recipe..."
        className="w-full min-h-[90px] resize-y rounded-xl border border-gray-200 px-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selected || submitting}
        className="mt-4 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition-colors text-white font-semibold px-6 py-2.5 rounded-full"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

export default function ReviewsSection({ recipeId }) {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const hasReviewed = user
    ? reviews.some((r) => r.user._id === user._id)
    : false;

  useEffect(() => {
    if (!recipeId) return;
    getReviews({ recipe: recipeId })   // ← fixed: pass an object, not a bare string
      .then(({ reviews, avg }) => {
        setReviews(reviews);
        setAvg(avg);
      })
      .finally(() => setLoading(false));
  }, [recipeId]);

  const handleSubmit = async ({ rating, comment }) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const review = await createReview({ recipeId, rating, comment });
      setReviews((prev) => [review, ...prev]);
      setAvg((prevAvg) => {
        const newTotal = reviews.length + 1;
        return (prevAvg * reviews.length + rating) / newTotal;
      });
    } catch (err) {
      setSubmitError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      const updated = reviews.filter((r) => r._id !== reviewId);
      setReviews(updated);
      setAvg(
        updated.length > 0
          ? updated.reduce((sum, r) => sum + r.rating, 0) / updated.length
          : 0
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading reviews...</p>;

  return (
    <div className="flex flex-col gap-4">
      <ReviewSummaryBar avg={avg} total={reviews.length} />

      {reviews.map((r) => (
        <ReviewCard
          key={r._id}
          review={r}
          currentUserId={user?._id}
          onDelete={handleDelete}
        />
      ))}

      {user && !hasReviewed && (
        <LeaveReview
          onSubmit={handleSubmit}
          submitting={submitting}
          error={submitError}
        />
      )}

      {!user && (
        <p className="text-center text-gray-500 text-sm py-4">
          <a href="/signin" className="text-orange-500 font-medium hover:underline">Sign in</a> to leave a review.
        </p>
      )}

      {user && hasReviewed && (
        <p className="text-center text-gray-500 text-sm py-2">You've already reviewed this recipe.</p>
      )}
    </div>
  );
}