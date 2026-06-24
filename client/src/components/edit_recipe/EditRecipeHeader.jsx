import { EditIcon } from "../../assets/icons/Icons";

export default function EditRecipeHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 mb-3">
        <EditIcon className="w-7 h-7" stroke="#ea6424" />
        <h1 className="text-[#ea6424] font-bold text-2xl md:text-3xl">Edit Recipe</h1>
      </div>
      <p className="text-gray-500 text-sm">Update your delicious creation below.</p>
    </div>
  );
}
