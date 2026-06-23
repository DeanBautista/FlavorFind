import Input from "../add_recipe/Input";
import FormLabel from "../add_recipe/FormLabel";
import Textarea from "../add_recipe/TextArea";
import CardSection from "../add_recipe/CardSection";

export default function BasicInfoSection({
  categories,
  formData,
  onInputChange,
  onCategoryChange,
}) {
  return (
    <CardSection title="Basic info" icon={<span className="text-lg">📋</span>}>
      <div className="space-y-5">
        <div>
          <FormLabel required>Recipe title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="e.g., Creamy Garlic Parmesan Pasta"
          />
        </div>
        <div>
          <FormLabel required>Short description <span className="text-xs font-normal text-gray-400">(max 200 chars)</span></FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="A delightful creamy pasta with aromatic garlic and parmesan..."
            maxLength={200}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <FormLabel required>Categories</FormLabel>
            <div className="flex flex-wrap gap-4 pt-1">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={formData.categories.includes(cat)}
                    onChange={() => onCategoryChange(cat)}
                    className="w-4 h-4 accent-[#ea6424]"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
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
                    onChange={onInputChange}
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
  );
}
