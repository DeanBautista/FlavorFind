import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import EditProfileModal from "../components/profile_page/EditProfileModal";
import ProfileHeader from "../components/profile_page/ProfileHeader";
import ProfileNavigationTabs from "../components/profile_page/ProfileNavigationTabs";
import ProfileStats from "../components/profile_page/ProfileStats";
import ProfileTabContent from "../components/profile_page/ProfileTabContent";
import { AuthContext } from "../context/AuthContext";
import { getUserRecipes, getPublicUser } from "../api/userApi";
import { getRecipes, getSavedRecipes, deleteRecipe  } from "../api/recipeApi";
import { getReviews } from "../api/reviewApi";

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const { userId } = useParams(); // present on /profile/:userId, absent on /profile
  const navigate = useNavigate();

  // If a userId param is present and it matches the logged-in user,
  // just redirect to the canonical /profile route.
  useEffect(() => {
    if (userId && user?._id && userId === user._id.toString()) {
      navigate("/profile", { replace: true });
    }
  }, [userId, user?._id, navigate]);

  // Are we viewing someone else's profile?
  const isOwnProfile = !userId;

  const [activeTab, setActiveTab] = useState("recipes");
  const [editOpen, setEditOpen] = useState(false);

  // ── Public user state (used when !isOwnProfile) ──────────────────────────
  const [publicUser, setPublicUser] = useState(null);
  const [publicUserLoading, setPublicUserLoading] = useState(!isOwnProfile);
  const [publicUserError, setPublicUserError] = useState("");

  // ── Own-profile state ────────────────────────────────────────────────────
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [likedRecipes, setLikedRecipes] = useState([]);
  const [likesLoading, setLikesLoading] = useState(true);
  const [likesError, setLikesError] = useState("");

  // Saved recipes are private — only ever fetched/shown for the logged-in
  // user's own profile. See the "saved" case below and ProfileNavigationTabs/
  // ProfileTabContent, which omit this tab entirely when !isOwnProfile.
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  // ── Fetch public user + their recipes ────────────────────────────────────
  useEffect(() => {
    if (isOwnProfile) return;

    let isMounted = true;

    const fetchPublicProfile = async () => {
      setPublicUserLoading(true);
      setPublicUserError("");
      try {
        const userData = await getPublicUser(userId);
        if (isMounted) setPublicUser(userData);
      } catch {
        if (isMounted) setPublicUserError("Couldn't load this profile. Please try again.");
      } finally {
        if (isMounted) setPublicUserLoading(false);
      }
    };

    const fetchPublicRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getRecipes({ author: userId });
        const list = Array.isArray(data) ? data : data.recipes || [];
        if (isMounted) setRecipes(list);
      } catch {
        if (isMounted) setError("Couldn't load their recipes. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchPublicLikedRecipes = async () => {
      setLikesLoading(true);
      setLikesError("");
      try {
        const data = await getRecipes({ likedBy: userId });
        const list = Array.isArray(data) ? data : data.recipes || [];
        if (isMounted) setLikedRecipes(list);
      } catch {
        if (isMounted) setLikesError("Couldn't load their liked recipes. Please try again.");
      } finally {
        if (isMounted) setLikesLoading(false);
      }
    };

    fetchPublicProfile();
    fetchPublicRecipes();
    fetchPublicLikedRecipes();

    // Saved recipes are private and intentionally NOT fetched for other
    // users' profiles — the Saved tab itself is hidden in this case (see
    // visibleTabs below), so there's nothing to load.

    return () => {
      isMounted = false;
    };
  }, [userId, isOwnProfile]);

  // ── Fetch own profile data ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOwnProfile || !user?._id) return;

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
  }, [user?._id, isOwnProfile]);

  const handleProfileSave = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await deleteRecipe(recipeId);
      setRecipes((prev) => prev.filter((r) => r._id.toString() !== recipeId.toString()));
    } catch (err) {
      setError(err.message || "Couldn't delete recipe. Please try again.");
    }
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (!isOwnProfile && publicUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <p className="text-stone-500">Loading profile...</p>
      </div>
    );
  }

  if (!isOwnProfile && publicUserError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <p className="text-red-500">{publicUserError}</p>
      </div>
    );
  }

  if (isOwnProfile && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <p className="text-stone-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  // ── Derive display values ─────────────────────────────────────────────────
  const displayUser = isOwnProfile ? user : publicUser;
  const avatarSrc =
    displayUser?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${displayUser?.username}`;
  const recipesCount = recipes.length;
  const totalLikes = recipes.reduce((sum, r) => sum + (r.likes?.length || 0), 0);
  const reviewsCount = isOwnProfile ? reviews.length : 0;

  // Own profile: Recipes, Likes, Saved, Reviews.
  // Other user's profile: Recipes, Likes only — Saved is private (a personal
  // bookmark list, not public activity) and Reviews are also owner-only.
  const visibleTabs = isOwnProfile
    ? ["recipes", "likes", "saved", "reviews"]
    : ["recipes", "likes"];

  // If the active tab is no longer visible (e.g. navigated from own profile),
  // fall back to "recipes".
  const safeActiveTab = visibleTabs.includes(activeTab) ? activeTab : "recipes";

  return (
    <>
      <Header />
      {isOwnProfile && editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={handleProfileSave}
        />
      )}

      <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6">
        <div className="max-w-[1232px] mx-auto space-y-6 animate-fade-in-up">
          <ProfileHeader
            user={displayUser}
            avatarSrc={avatarSrc}
            // Only show the Edit button on the owner's own profile
            onEdit={isOwnProfile ? () => setEditOpen(true) : null}
          />

          <ProfileStats
            recipesCount={recipesCount}
            totalLikes={totalLikes}
            reviewsCount={reviewsCount}
          />

          <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm overflow-hidden">
            <ProfileNavigationTabs
              activeTab={safeActiveTab}
              onTabChange={setActiveTab}
              visibleTabs={visibleTabs}
              isOwnProfile={isOwnProfile}
            />
            <ProfileTabContent
              activeTab={safeActiveTab}
              isOwnProfile={isOwnProfile}
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
              onDeleteRecipe={isOwnProfile ? handleDeleteRecipe : undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
}