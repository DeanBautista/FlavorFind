import apiClient from './userApi'; // adjust to wherever your axios instance actually lives

export const createRecipe = async (recipeData) => {
  try {
    const response = await apiClient.post('/recipes', recipeData);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || { message: error.message };
    throw errorData;
  }
};

// NEW: updates an existing recipe. Mirrors createRecipe's error handling.
// Expects a backend route like `router.put('/recipes/:id', ...)` that
// authorizes the request (only the recipe's author should be able to edit it)
// and applies the same field validation as createRecipe.
export const updateRecipe = async (id, recipeData) => {
  try {
    const response = await apiClient.put(`/recipes/${id}`, recipeData);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || { message: error.message };
    throw errorData;
  }
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post('/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data; // { url, publicId }
};

// getRecipes now accepts an optional params object that maps directly onto
// the query string the backend understands:
//   { search, category, difficulty, maxTime, sort, page, limit }
// Falsy/empty values are stripped so we don't send `?category=&difficulty=`
// on every request.
export const getRecipes = async (params = {}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    const response = await apiClient.get('/recipes', { params: cleanParams });
    return response.data;
  } catch (error) {
    // Normalize the error shape so consumers can expect { message }
    const errorData = error.response?.data || { message: error.message };
    throw errorData;
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await apiClient.get(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || { message: error.message };
    throw errorData;
  }
};

export const toggleLikeRecipe = async (id) => {
  try {
    const response = await apiClient.post(`/recipes/${id}/like`);
    return response.data; // { liked, likesCount }
  } catch (error) {
    const errorData = error.response?.data || { message: error.message };
    throw errorData;
  }
};

export const toggleSaveRecipe = async (id) => {
  try {
    const response = await apiClient.post(`/recipes/${id}/save`);
    return response.data; // { saved }
  } catch (error) {
    const errorData = error.response?.data || { message: error.message };
    throw errorData;
  }
};

export const getSavedRecipes = async (params = {}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
    );
    const response = await apiClient.get('/recipes/saved-recipes', { params: cleanParams });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || { message: error.message };
    throw errorData;
  }
};