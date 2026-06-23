const EditIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ea6424"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

export default function EditRecipeHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 mb-3">
        <EditIcon />
        <h1 className="text-[#ea6424] font-bold text-2xl md:text-3xl">Edit Recipe</h1>
      </div>
      <p className="text-gray-500 text-sm">Update your delicious creation below.</p>
    </div>
  );
}
