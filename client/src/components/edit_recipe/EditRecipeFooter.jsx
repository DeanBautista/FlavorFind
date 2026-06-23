import { CheckIcon } from "../../assets/icons/Icons";

export default function EditRecipeFooter({
  error,
  success,
  isSaving,
  isUploadingImage,
  onSave,
}) {
  return (
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
        onClick={onSave}
        disabled={isSaving}
        className="w-full md:w-auto bg-[#ea6424] hover:bg-[#d45315] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center text-sm"
      >
        <CheckIcon />
        {isUploadingImage ? "Saving changes..." : isSaving ? "Saving changes..." : "Save changes"}
      </button>
    </div>
  );
}
