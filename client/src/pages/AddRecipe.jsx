import { useState, useRef } from 'react';
import { ArrowLeftIcon } from "../assets/icons/Icons";
import { createRecipe, uploadImage } from '../api/recipeApi';
import { useNavigate } from "react-router-dom";
import AddRecipeHeader from '../components/add_recipe/AddRecipeHeader';
import BasicInfoSection from '../components/add_recipe/BasicInfoSection';
import TimeServingsSection from '../components/add_recipe/TimeServingsSection';
import RecipeImageSection from '../components/add_recipe/RecipeImageSection';
import IngredientsSection from '../components/add_recipe/IngredientsSection';
import InstructionsSection from '../components/add_recipe/InstructionsSection';
import NutritionSection from '../components/add_recipe/NutritionSection';
import AddRecipeFooter from '../components/add_recipe/AddRecipeFooter';

// Define available categories
const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Quick', 'Italian', 'Healthy'];

// Initial state constants to avoid duplication when resetting
const initialFormData = {
  title: '',
  description: '',
  categories: [],
  difficulty: 'Medium',
  prepTime: '',
  cookTime: '',
  servings: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: ''
};

const initialIngredients = [
  { id: 1, amount: '', unit: '', name: '' }
];

const initialInstructions = [
  { id: 1, text: '' }
];

const initialNumericErrors = {
  prepTime: '',
  cookTime: '',
  servings: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: ''
};

export default function AddRecipe() {

  // --- Global Form State ---
  const [formData, setFormData] = useState(initialFormData);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Numeric field errors ---
  const [numericErrors, setNumericErrors] = useState(initialNumericErrors);

  // --- Dynamic Lists State ---
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [instructions, setInstructions] = useState(initialInstructions);

  // --- Recipe Image State & Ref ---
  // recipeImage shape: { file: File, previewUrl: string } | null
  const [recipeImage, setRecipeImage] = useState(null);
  const fileInputRef = useRef(null);

  // --- Helper: test for positive number (decimal allowed) ---
  const isPositiveNumber = (value) => /^\d*\.?\d+$/.test(value);

  // --- Handlers for Main Form (except categories) ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['prepTime', 'cookTime', 'servings', 'calories', 'protein', 'carbs', 'fat'];

    if (numericFields.includes(name) && value !== '') {
      if (!isPositiveNumber(value)) {
        setNumericErrors(prev => ({
          ...prev,
          [name]: 'Only positive numbers allowed',
        }));
        return; // do not update state, keep previous valid value
      } else {
        setNumericErrors(prev => ({ ...prev, [name]: '' }));
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Category checkbox handler ---
  const handleCategoryChange = (category) => {
    setFormData(prev => {
      const currentCategories = prev.categories;
      if (currentCategories.includes(category)) {
        return { ...prev, categories: currentCategories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...currentCategories, category] };
      }
    });
  };

  // --- Handlers for Ingredients ---
  const handleIngredientChange = (id, field, value) => {
    setIngredients(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    setIngredients([...ingredients, { id: newId, amount: '', unit: '', name: '' }]);
  };

  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- Handlers for Instructions ---
  const handleInstructionChange = (id, value) => {
    setInstructions(prev => prev.map(item =>
      item.id === id ? { ...item, text: value } : item
    ));
  };

  const addInstruction = () => {
    const newId = instructions.length > 0 ? Math.max(...instructions.map(i => i.id)) + 1 : 1;
    setInstructions([...instructions, { id: newId, text: '' }]);
  };

  const removeInstruction = (id) => {
    if (instructions.length > 1) {
      setInstructions(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- Handlers for Recipe Image ---
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setRecipeImage({ file, previewUrl });
    }
  };

  const handleImageRemove = () => {
    if (recipeImage?.previewUrl) URL.revokeObjectURL(recipeImage.previewUrl);
    setRecipeImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Reset Form to initial state, but keep success message visible ---
  const resetForm = () => {
    setFormData(initialFormData);
    setIngredients(initialIngredients);
    setInstructions(initialInstructions);
    setNumericErrors(initialNumericErrors);
    setError('');
    // Do NOT clear success message
    if (recipeImage?.previewUrl) {
      URL.revokeObjectURL(recipeImage.previewUrl);
    }
    setRecipeImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Publish Action ---
  const handlePublish = async () => {
    // Block submission if any numeric field has an error
    const hasNumericErrors = Object.values(numericErrors).some(err => err !== '');
    if (hasNumericErrors) {
      setError('Please fix the highlighted fields before publishing.');
      return;
    }

    try {
      setIsPublishing(true);
      setError("");
      setSuccess("");

      // Upload the image to Cloudinary (via backend) first, if one was selected
      let imageUrl = null;
      if (recipeImage?.file) {
        try {
          setIsUploadingImage(true);
          const { url } = await uploadImage(recipeImage.file);
          imageUrl = url;
        } catch (uploadErr) {
          console.error(uploadErr);
          setError("Failed to upload image. Please try again.");
          setIsPublishing(false);
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      const finalData = {
        ...formData,
        ingredients: ingredients.map(({ id, ...rest }) => rest),
        instructions: instructions.map(({ id, ...rest }) => rest),
        image: imageUrl,
      };

      const createdRecipe = await createRecipe(finalData);

      setSuccess("Recipe published successfully!");
      console.log(createdRecipe);

      // Clear all input fields but keep the success message
      resetForm();

    } catch (err) {
      console.error(err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message);
            break;

          case 401:
            setError("Please sign in to publish recipes.");
            break;

          case 403:
            setError("You don't have permission to perform this action.");
            break;

          case 500:
            setError("Server error. Please try again later.");
            break;

          default:
            setError(
              err.response.data.message ||
              "Failed to publish recipe."
            );
        }
      } else if (err.request) {
        setError(
          "Unable to connect to the server. Check your internet connection."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans pb-20 text-[#464646]">
      {/* --- BACK BUTTON (fixed, left edge) --- */}
      <button
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeftIcon />
      </button>

      <div className="animate-fade-in-up max-w-[832px] mx-auto px-4 pt-8 pb-4 w-full">

        <AddRecipeHeader />

        <BasicInfoSection
          categories={CATEGORIES}
          formData={formData}
          onInputChange={handleInputChange}
          onCategoryChange={handleCategoryChange}
        />

        <TimeServingsSection
          formData={formData}
          numericErrors={numericErrors}
          onInputChange={handleInputChange}
        />

        <RecipeImageSection
          fileInputRef={fileInputRef}
          recipeImage={recipeImage}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />

        <IngredientsSection
          ingredients={ingredients}
          onIngredientChange={handleIngredientChange}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
        />

        <InstructionsSection
          instructions={instructions}
          onInstructionChange={handleInstructionChange}
          onAddInstruction={addInstruction}
          onRemoveInstruction={removeInstruction}
        />

        <NutritionSection
          formData={formData}
          numericErrors={numericErrors}
          onInputChange={handleInputChange}
        />

        <AddRecipeFooter
          error={error}
          success={success}
          isPublishing={isPublishing}
          isUploadingImage={isUploadingImage}
          onPublish={handlePublish}
        />

      </div>
    </div>
  );
}