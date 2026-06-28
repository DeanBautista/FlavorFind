import { RemoveIcon } from "../../assets/icons/Icons";
import CardSection from './CardSection';

export default function RecipeImageSection({ fileInputRef, recipeImage, onImageUpload, onImageRemove }) {
  return (
    <CardSection title="Recipe image" icon={<span className="text-lg">🖼️</span>}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
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
              onClick={(e) => { e.stopPropagation(); onImageRemove(); }}
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
  );
}