import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { toggleLikeRecipe, toggleSaveRecipe } from "../../api/recipeApi";
import {
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
} from "../../assets/icons/Icons";

function ActionButton({ icon, label, onClick, active, activeClassName }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? activeClassName || "bg-orange-100 text-orange-700"
          : "bg-orange-50 text-gray-700 hover:bg-orange-100"
      }`}
    >
      <span className={active ? "text-orange-600" : "text-gray-600"}>
        {icon}
      </span>
      {label}
    </button>
  );
}

export default function AuthorCard({
  author,
  recipeId,
  initialLikes = [],
  initialSaved = false,
}) {
  const { user } = useAuth();

  const username = author?.username || "Unknown chef";
  const avatar = author?.avatar || "https://i.pravatar.cc/80?img=33";
  const authorId = author?._id;

  const [liked, setLiked] = useState(
    !!user && initialLikes.some((likeId) => likeId.toString() === user._id?.toString())
  );
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  const [likeSubmitting, setLikeSubmitting] = useState(false);

  const [saved, setSaved] = useState(initialSaved);
  const [saveSubmitting, setSaveSubmitting] = useState(false);

  const handleLikeClick = async () => {
    if (!user) return;
    if (likeSubmitting) return;

    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((c) => (nextLiked ? c + 1 : c - 1));
    setLikeSubmitting(true);

    try {
      const data = await toggleLikeRecipe(recipeId);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (err) {
      setLiked((prev) => !prev);
      setLikesCount((c) => (nextLiked ? c - 1 : c + 1));
      console.error("Failed to toggle like:", err);
    } finally {
      setLikeSubmitting(false);
    }
  };

  const handleSaveClick = async () => {
    if (!user) return;
    if (saveSubmitting) return;

    const nextSaved = !saved;
    setSaved(nextSaved);
    setSaveSubmitting(true);

    try {
      const data = await toggleSaveRecipe(recipeId);
      setSaved(data.saved);
    } catch (err) {
      setSaved((prev) => !prev);
      console.error("Failed to toggle save:", err);
    } finally {
      setSaveSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-5 sm:px-6 py-4 sm:py-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={username}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{username}</p>
            {authorId && (
              <Link
                to={`/profile/${authorId}`}
                className="text-orange-600 text-sm font-medium inline-flex items-center gap-1 hover:underline"
              >
                View Profile <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<HeartIcon className="w-4 h-4" filled={liked} />}
            label={likesCount > 0 ? `Like (${likesCount})` : "Like"}
            onClick={handleLikeClick}
            active={liked}
          />
          <ActionButton
            icon={<BookmarkIcon className="w-4 h-4" filled={saved} />}
            label={saved ? "Saved" : "Save"}
            onClick={handleSaveClick}
            active={saved}
          />
          <ActionButton icon={<ShareIcon className="w-4 h-4" />} label="Share" />
        </div>
      </div>
    </div>
  );
}