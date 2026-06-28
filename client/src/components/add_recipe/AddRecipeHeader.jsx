export default function AddRecipeHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 mb-3">
        <span className="text-[#ea6424] text-2xl">+</span>
        <h1 className="text-[#ea6424] font-bold text-2xl md:text-3xl">Share your recipe</h1>
      </div>
      <p className="text-gray-500 text-sm">Fill the details below and inspire the community.</p>
    </div>
  );
}