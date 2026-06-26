import ProfileRecipeGrid from "./ProfileRecipeGrid";
import ProfileReviewCard from "./ProfileReviewCard";

function TabState({ loading, error, empty, loadingText, emptyText, children }) {
  if (loading) {
    return <p className="text-stone-400 text-sm py-8 text-center">{loadingText}</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm py-8 text-center">{error}</p>;
  }

  if (empty) {
    return <p className="text-stone-400 text-sm py-8 text-center">{emptyText}</p>;
  }

  return children;
}

export default function ProfileTabContent({
  activeTab,
  isOwnProfile,
  recipes,
  loading,
  error,
  likedRecipes,
  likesLoading,
  likesError,
  savedRecipes,
  savedLoading,
  savedError,
  reviews,
  reviewsLoading,
  reviewsError,
  onDeleteRecipe,
}) {
  return (
    <div className="p-4 sm:p-6">
      {activeTab === "recipes" && (
        <TabState
          loading={loading}
          error={error}
          empty={recipes.length === 0}
          loadingText="Loading recipes..."
          emptyText={
            isOwnProfile
              ? "You haven't added any recipes yet."
              : "This user hasn't added any recipes yet."
          }
        >
          <ProfileRecipeGrid recipes={recipes} isOwner={isOwnProfile} onDelete={onDeleteRecipe} />
        </TabState>
      )}

      {activeTab === "likes" && (
        <TabState
          loading={likesLoading}
          error={likesError}
          empty={likedRecipes.length === 0}
          loadingText="Loading liked recipes..."
          emptyText={
            isOwnProfile
              ? "You haven't liked any recipes yet."
              : "This user hasn't liked any recipes yet."
          }
        >
          <ProfileRecipeGrid recipes={likedRecipes} />
        </TabState>
      )}

      {activeTab === "saved" && (
        <TabState
          loading={savedLoading}
          error={savedError}
          empty={savedRecipes.length === 0}
          loadingText="Loading saved recipes..."
          emptyText={
            isOwnProfile
              ? "You haven't saved any recipes yet."
              : "This user hasn't saved any recipes yet."
          }
        >
          <ProfileRecipeGrid recipes={savedRecipes} />
        </TabState>
      )}

      {activeTab === "reviews" && (
        <TabState
          loading={reviewsLoading}
          error={reviewsError}
          empty={reviews.length === 0}
          loadingText="Loading your reviews..."
          emptyText="You haven't reviewed any recipes yet."
        >
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {reviews.map((review) => (
              <ProfileReviewCard key={review._id} review={review} />
            ))}
          </div>
        </TabState>
      )}
    </div>
  );
}