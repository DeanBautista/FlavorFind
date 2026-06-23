import { useContext, useEffect, useState } from "react";
import Header from "../components/header/Header";
import EditProfileModal from "../components/profile_page/EditProfileModal";
import ProfileHeader from "../components/profile_page/ProfileHeader";
import ProfileNavigationTabs from "../components/profile_page/ProfileNavigationTabs";
import ProfileStats from "../components/profile_page/ProfileStats";
import ProfileTabContent from "../components/profile_page/ProfileTabContent";
import { AuthContext } from "../context/AuthContext";
import { getUserRecipes } from "../api/userApi";
import { getRecipes, getSavedRecipes } from "../api/recipeApi";
import { getReviews } from "../api/reviewApi";

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("recipes");
  const [editOpen, setEditOpen] = useState(false);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [likedRecipes, setLikedRecipes] = useState([]);
  const [likesLoading, setLikesLoading] = useState(true);
  const [likesError, setLikesError] = useState("");

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const fetchUserRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getUserRecipes(user._id);
        setRecipes(data);
      } catch {
        setError("Couldn't load your recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedRecipes = async () => {
      setLikesLoading(true);
      setLikesError("");
      try {
        const data = await getRecipes({ likedBy: user._id });
        setLikedRecipes(Array.isArray(data) ? data : data.recipes || []);
      } catch {
        setLikesError("Couldn't load liked recipes. Please try again.");
      } finally {
        setLikesLoading(false);
      }
    };

    const fetchSavedRecipes = async () => {
      setSavedLoading(true);
      setSavedError("");
      try {
        const data = await getSavedRecipes();
        setSavedRecipes(Array.isArray(data) ? data : data.recipes || []);
      } catch {
        setSavedError("Couldn't load saved recipes. Please try again.");
      } finally {
        setSavedLoading(false);
      }
    };

    const fetchUserReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");
      try {
        const data = await getReviews({ user: user._id });
        const list = Array.isArray(data) ? data : data.reviews || [];
        setReviews(list);
      } catch {
        setReviewsError("Couldn't load your reviews. Please try again.");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchUserRecipes();
    fetchLikedRecipes();
    fetchSavedRecipes();
    fetchUserReviews();
  }, [user?._id]);

  const handleProfileSave = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <p className="text-stone-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  const avatarSrc =
    user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`;
  const recipesCount = recipes.length;
  const totalLikes = recipes.reduce((sum, recipe) => sum + (recipe.likes?.length || 0), 0);
  const reviewsCount = reviews.length;

  return (
    <>
      <Header />
      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={handleProfileSave}
        />
      )}

      <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6">
        <div className="max-w-[1232px] mx-auto space-y-6 animate-fade-in-up">
          <ProfileHeader
            user={user}
            avatarSrc={avatarSrc}
            onEdit={() => setEditOpen(true)}
          />

          <ProfileStats
            recipesCount={recipesCount}
            totalLikes={totalLikes}
            reviewsCount={reviewsCount}
          />

          <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm overflow-hidden">
            <ProfileNavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <ProfileTabContent
              activeTab={activeTab}
              recipes={recipes}
              loading={loading}
              error={error}
              likedRecipes={likedRecipes}
              likesLoading={likesLoading}
              likesError={likesError}
              savedRecipes={savedRecipes}
              savedLoading={savedLoading}
              savedError={savedError}
              reviews={reviews}
              reviewsLoading={reviewsLoading}
              reviewsError={reviewsError}
            />
          </div>
        </div>
      </div>
    </>
  );
}
