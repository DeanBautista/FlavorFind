export function EditRecipeLoading() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans flex items-center justify-center text-[#464646]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#ea6424] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading recipe…</p>
      </div>
    </div>
  );
}

export function EditRecipeLoadError({ message }) {
  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans flex items-center justify-center text-[#464646]">
      <div className="text-center max-w-sm px-4">
        <p className="text-red-500 font-medium mb-3">{message}</p>
        <button
          onClick={() => window.history.back()}
          className="bg-[#f0ebe7] hover:bg-[#e5ded8] text-[#5a4f47] font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
