import apiClient from "./userApi";

export const getReviews = async (params = {}) => {
  if (params !== null && typeof params !== "object") {
    throw new TypeError(
      `getReviews expects a params object (e.g. { recipe: id }), got: ${typeof params}`
    );
  }
  const { data } = await apiClient.get("/reviews", { params });
  return data;
};

export const createReview = async ({ recipeId, rating, comment }) => {
  const { data } = await apiClient.post("/reviews", {
    recipe: recipeId,
    rating,
    comment,
  });
  return data;
};

export const deleteReview = async (reviewId) => {
  const { data } = await apiClient.delete(`/reviews/${reviewId}`);
  return data;
};