import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from "../assets/icons/Icons";
import { getRecipeById, updateRecipe, uploadImage } from '../api/recipeApi';
import BasicInfoSection from '../components/edit_recipe/BasicInfoSection';
import EditRecipeFooter from '../components/edit_recipe/EditRecipeFooter';
import EditRecipeHeader from '../components/edit_recipe/EditRecipeHeader';
import { EditRecipeLoadError, EditRecipeLoading } from '../components/edit_recipe/EditRecipeStates';
import IngredientsSection from '../components/edit_recipe/IngredientsSection';
import InstructionsSection from '../components/edit_recipe/InstructionsSection';
import NutritionSection from '../components/edit_recipe/NutritionSection';
import RecipeImageSection from '../components/edit_recipe/RecipeImageSection';
import TimeServingsSection from '../components/edit_recipe/TimeServingsSection';

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

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Load State ---
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // --- Global Form State ---
  const [formData, setFormData] = useState(initialFormData);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Numeric field errors ---
  const [numericErrors, setNumericErrors] = useState(initialNumericErrors);

  // --- Dynamic Lists State ---
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [instructions, setInstructions] = useState(initialInstructions);

  // --- Recipe Image State & Ref ---
  // recipeImage shape: { file: File|null, previewUrl: string } | null
  // file is null when the image came from the server (existing recipe image)
  // and hasn't been replaced yet.
  const [recipeImage, setRecipeImage] = useState(null);
  const fileInputRef = useRef(null);

  // --- Fetch the existing recipe and pre-fill the form ---
  useEffect(() => {
    let isMounted = true;

    const loadRecipe = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const recipe = await getRecipeById(id);
        if (!isMounted) return;

        setFormData({
          title: recipe.title || '',
          description: recipe.description || '',
          categories: recipe.categories || [],
          difficulty: recipe.difficulty || 'Medium',
          prepTime: recipe.prepTime ?? '',
          cookTime: recipe.cookTime ?? '',
          servings: recipe.servings ?? '',
          calories: recipe.nutrition?.calories ?? '',
          protein: recipe.nutrition?.protein ?? '',
          carbs: recipe.nutrition?.carbs ?? '',
          fat: recipe.nutrition?.fat ?? '',
        });

        setIngredients(
          Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
            ? recipe.ingredients.map((ing, index) => ({
                id: index + 1,
                amount: ing.amount ?? '',
                unit: ing.unit ?? '',
                name: ing.name ?? '',
              }))
            : initialIngredients
        );

        setInstructions(
          Array.isArray(recipe.steps) && recipe.steps.length > 0
            ? recipe.steps.map((step, index) => ({
                id: index + 1,
                text: step.instruction ?? '',
              }))
            : initialInstructions
        );

        if (recipe.image) {
          setRecipeImage({ file: null, previewUrl: recipe.image });
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoadError(err.message || 'Failed to load this recipe.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadRecipe();
    return () => { isMounted = false; };
  }, [id]);

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
      // Only revoke if the previous preview was a local blob URL (i.e. came
      // from a File), not the original Cloudinary URL from the server.
      if (recipeImage?.previewUrl && recipeImage.file) {
        URL.revokeObjectURL(recipeImage.previewUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setRecipeImage({ file, previewUrl });
    }
  };

  const handleImageRemove = () => {
    if (recipeImage?.previewUrl && recipeImage.file) {
      URL.revokeObjectURL(recipeImage.previewUrl);
    }
    setRecipeImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Save Action ---
  const handleSave = async () => {
    // Block submission if any numeric field has an error
    const hasNumericErrors = Object.values(numericErrors).some(err => err !== '');
    if (hasNumericErrors) {
      setError('Please fix the highlighted fields before saving.');
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      // Figure out what the image field should be on save:
      // - a newly selected file gets uploaded and replaces the URL
      // - an untouched existing image keeps its current URL
      // - a removed image is sent as an empty string
      let imageUrl = '';
      if (recipeImage?.file) {
        try {
          setIsUploadingImage(true);
          const { url } = await uploadImage(recipeImage.file);
          imageUrl = url;
        } catch (uploadErr) {
          console.error(uploadErr);
          setError("Failed to upload image. Please try again.");
          setIsSaving(false);
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      } else if (recipeImage?.previewUrl) {
        imageUrl = recipeImage.previewUrl;
      }

      const finalData = {
        ...formData,
        ingredients: ingredients.map((ingredient) => ({
          amount: ingredient.amount,
          unit: ingredient.unit,
          name: ingredient.name,
        })),
        instructions: instructions.map((instruction) => ({
          text: instruction.text,
        })),
        image: imageUrl,
      };

      const updatedRecipe = await updateRecipe(id, finalData);

      setSuccess("Recipe updated successfully!");
      console.log(updatedRecipe);

      // Head back to the recipe's page after a short beat so the success
      // message is actually visible.
      setTimeout(() => navigate(`/recipes/${id}`), 1200);

    } catch (err) {
      console.error(err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message);
            break;

          case 401:
            setError("Please sign in to edit recipes.");
            break;

          case 403:
            setError("You don't have permission to edit this recipe.");
            break;

          case 404:
            setError("This recipe no longer exists.");
            break;

          case 500:
            setError("Server error. Please try again later.");
            break;

          default:
            setError(
              err.response.data.message ||
              "Failed to save changes."
            );
        }
      } else if (err.request) {
        setError(
          "Unable to connect to the server. Check your internet connection."
        );
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // --- Loading state ---
  if (isLoading) {
    return <EditRecipeLoading />;
  }

  // --- Load error state ---
  if (loadError) {
    return <EditRecipeLoadError message={loadError} />;
  }

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

        <EditRecipeHeader />

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

        <EditRecipeFooter
          error={error}
          success={success}
          isSaving={isSaving}
          isUploadingImage={isUploadingImage}
          onSave={handleSave}
        />

      </div>
    </div>
  );
}
