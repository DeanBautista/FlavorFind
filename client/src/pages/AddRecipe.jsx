import { useState, useRef } from 'react';
import { ArrowLeftIcon, PlusIcon, CheckIcon, RemoveIcon } from "../assets/icons/Icons";
import Input from '../components/add_recipe/Input';
import FormLabel from '../components/add_recipe/FormLabel';
import Textarea from '../components/add_recipe/TextArea';
import CardSection from '../components/add_recipe/CardSection';
import { createRecipe, uploadImage } from '../api/recipeApi';
import { useNavigate } from "react-router-dom";

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

        {/* --- Header --- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#ea6424] text-2xl">+</span>
            <h1 className="text-[#ea6424] font-bold text-2xl md:text-3xl">Share your recipe</h1>
          </div>
          <p className="text-gray-500 text-sm">Fill the details below and inspire the community.</p>
        </div>

        {/* --- Basic Info --- */}
        <CardSection title="Basic info" icon={<span className="text-lg">📋</span>}>
          <div className="space-y-5">
            <div>
              <FormLabel required>Recipe title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Creamy Garlic Parmesan Pasta"
              />
            </div>
            <div>
              <FormLabel required>Short description <span className="text-xs font-normal text-gray-400">(max 200 chars)</span></FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A delightful creamy pasta with aromatic garlic and parmesan..."
                maxLength={200}
              />
            </div>
            {/* Category & Difficulty now stacked vertically */}
            <div className="flex flex-col gap-6">
              {/* Categories (checkboxes) */}
              <div>
                <FormLabel required>Categories</FormLabel>
                <div className="flex flex-wrap gap-4 pt-1">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        value={cat}
                        checked={formData.categories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="w-4 h-4 accent-[#ea6424]"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
              {/* Difficulty (radio buttons) */}
              <div>
                <FormLabel required>Difficulty</FormLabel>
                <div className="flex items-center gap-6 pt-1">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <label key={level} className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={formData.difficulty === level}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#ea6424]"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardSection>

        {/* --- Time & Servings --- */}
        <CardSection title="Time & Servings" icon={<span className="text-lg">🕒</span>}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <FormLabel>Prep time (mins)</FormLabel>
              <Input name="prepTime" value={formData.prepTime} onChange={handleInputChange} placeholder="15" />
              {numericErrors.prepTime && (
                <p className="text-red-500 text-xs mt-1">{numericErrors.prepTime}</p>
              )}
            </div>
            <div>
              <FormLabel required>Cook time (mins)</FormLabel>
              <Input name="cookTime" value={formData.cookTime} onChange={handleInputChange} placeholder="30" />
              {numericErrors.cookTime && (
                <p className="text-red-500 text-xs mt-1">{numericErrors.cookTime}</p>
              )}
            </div>
            <div>
              <FormLabel>Servings</FormLabel>
              <Input name="servings" value={formData.servings} onChange={handleInputChange} placeholder="4" />
              {numericErrors.servings && (
                <p className="text-red-500 text-xs mt-1">{numericErrors.servings}</p>
              )}
            </div>
          </div>
        </CardSection>

        {/* --- Image --- */}
        <CardSection title="Recipe image" icon={<span className="text-lg">🖼️</span>}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="relative">
            {recipeImage ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                <img
                  src={recipeImage.previewUrl}
                  alt="Recipe preview"
                  className="w-full h-auto max-h-[400px] object-cover cursor-pointer group-hover:opacity-90 transition-opacity"
                  onClick={() => fileInputRef.current.click()}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="bg-white px-4 py-2 rounded-md text-sm font-medium pointer-events-auto shadow-lg">Click to replace</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleImageRemove(); }}
                  className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-gray-600 hover:text-red-500 p-2 rounded-full shadow-md transition-colors"
                >
                  <RemoveIcon />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-[#e5e5e5] rounded-xl bg-[#fbfbfa] hover:bg-gray-50 transition-colors cursor-pointer py-12 flex flex-col items-center justify-center text-gray-500"
              >
                <div className="bg-[#f4f0e8] p-3 rounded-full mb-3">
                  <span className="text-[#c79f69] text-xl">↑</span>
                </div>
                <span className="font-medium text-[#5a5a5a]">Drag & drop an image here or click to browse</span>
                <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG (max 5MB)</span>
              </div>
            )}
          </div>
        </CardSection>

        {/* --- Ingredients --- */}
        <CardSection title="Ingredients" icon={<span className="text-lg">🖊️</span>}>
          <div className="space-y-4">
            {ingredients.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                {/* MODIFIED: change flex container to column on mobile, row on sm+ */}
                <div className="sm:col-span-1 flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mb-1 shrink-0"></div>
                  <FormLabel>Amount</FormLabel>
                </div>
                <Input
                  value={item.amount}
                  onChange={(e) => handleIngredientChange(item.id, 'amount', e.target.value)}
                  placeholder="(e.g., 2 cups)"
                />
               </div>
                <div className="sm:col-span-1">
                  <FormLabel>Unit</FormLabel>
                  <Input
                    value={item.unit}
                    onChange={(e) => handleIngredientChange(item.id, 'unit', e.target.value)}
                    placeholder="(e.g., tbsp)"
                  />
                </div>
                <div className="sm:col-span-1">
                  <FormLabel>Ingredient name</FormLabel>
                  <Input
                    value={item.name}
                    onChange={(e) => handleIngredientChange(item.id, 'name', e.target.value)}
                    placeholder="Enter ingredient"
                  />
                </div>
                <div className="sm:col-span-1">
                  <button
                    onClick={() => removeIngredient(item.id)}
                    className="text-xs bg-[#f3f3f3] text-gray-500 hover:bg-gray-200 px-3 py-2 rounded flex items-center"
                  >
                    <RemoveIcon /> Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={addIngredient}
              className="mt-4 border border-dashed border-[#d4b092] text-[#e28044] bg-[#fdf9f6] hover:bg-[#fceee5] px-4 py-1.5 rounded-md text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <PlusIcon /> Add ingredient
            </button>
          </div>
        </CardSection>

        {/* --- Instructions --- */}
        <CardSection title="Instructions" icon={<span className="text-lg">📄</span>}>
          <div className="space-y-4">
            {instructions.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start gap-3">
                <div className="flex-1 w-full">
                  <Textarea
                    value={item.text}
                    onChange={(e) => handleInstructionChange(item.id, e.target.value)}
                    placeholder="Describe the step..."
                  />
                </div>
                <button
                  onClick={() => removeInstruction(item.id)}
                  className="text-xs bg-[#f3f3f3] text-gray-500 hover:bg-gray-200 px-3 py-2 rounded flex items-center whitespace-nowrap mt-1"
                >
                  <RemoveIcon /> Remove
                </button>
              </div>
            ))}
            <button
              onClick={addInstruction}
              className="mt-2 border border-dashed border-[#d4b092] text-[#e28044] bg-[#fdf9f6] hover:bg-[#fceee5] px-4 py-1.5 rounded-md text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <PlusIcon /> Add step
            </button>
          </div>
        </CardSection>

        {/* --- Nutrition --- */}
        <CardSection title="Nutrition (optional)" icon={<span className="text-lg">🍎</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <FormLabel>Calories (kcal)</FormLabel>
              <Input name="calories" value={formData.calories} onChange={handleInputChange} placeholder="e.g., 420" />
              {numericErrors.calories && (
                <p className="text-red-500 text-xs mt-1">{numericErrors.calories}</p>
              )}
            </div>
            <div>
              <FormLabel>Protein (g)</FormLabel>
              <Input name="protein" value={formData.protein} onChange={handleInputChange} placeholder="e.g., 18" />
              {numericErrors.protein && (
                <p className="text-red-500 text-xs mt-1">{numericErrors.protein}</p>
              )}
            </div>
            <div>
              <FormLabel>Carbs (g)</FormLabel>
              <Input name="carbs" value={formData.carbs} onChange={handleInputChange} placeholder="e.g., 55" />
              {numericErrors.carbs && (
                <p className="text-red-500 text-xs mt-1">{numericErrors.carbs}</p>
              )}
            </div>
            <div>
              <FormLabel>Fat (g)</FormLabel>
              <Input name="fat" value={formData.fat} onChange={handleInputChange} placeholder="e.g., 22" />
              {numericErrors.fat && (
                <p className="text-red-500 text-xs mt-1">{numericErrors.fat}</p>
              )}
            </div>
          </div>
        </CardSection>

        {/* --- Footer --- */}
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-4 md:p-6 flex flex-col-reverse md:flex-row justify-end gap-3">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
              {success}
            </div>
          )}
          <button 
            className="w-full md:w-auto bg-[#f0ebe7] hover:bg-[#e5ded8] text-[#5a4f47] font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full md:w-auto bg-[#ea6424] hover:bg-[#d45315] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center text-sm"
          >
            <CheckIcon />
            {isUploadingImage ? "Publishing recipe..." : isPublishing ? "Publishing recipe..." : "Publish recipe"}
          </button>
        </div>

      </div>
    </div>
  );
}