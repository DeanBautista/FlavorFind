import Input from "../add_recipe/Input";
import FormLabel from "../add_recipe/FormLabel";
import CardSection from "../add_recipe/CardSection";
import { PlusIcon, RemoveIcon } from "../../assets/icons/Icons";

export default function IngredientsSection({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
}) {
  return (
    <CardSection title="Ingredients" icon={<span className="text-lg">🖊️</span>}>
      <div className="space-y-4">
        {ingredients.map((item) => (
          <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-1 flex flex-col">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full mb-1 shrink-0"></div>
                <FormLabel>Amount</FormLabel>
              </div>
              <Input
                value={item.amount}
                onChange={(e) => onIngredientChange(item.id, 'amount', e.target.value)}
                placeholder="(e.g., 2 cups)"
              />
            </div>
            <div className="sm:col-span-1">
              <FormLabel>Unit</FormLabel>
              <Input
                value={item.unit}
                onChange={(e) => onIngredientChange(item.id, 'unit', e.target.value)}
                placeholder="(e.g., tbsp)"
              />
            </div>
            <div className="sm:col-span-1">
              <FormLabel>Ingredient name</FormLabel>
              <Input
                value={item.name}
                onChange={(e) => onIngredientChange(item.id, 'name', e.target.value)}
                placeholder="Enter ingredient"
              />
            </div>
            <div className="sm:col-span-1">
              <button
                onClick={() => onRemoveIngredient(item.id)}
                className="text-xs bg-[#f3f3f3] text-gray-500 hover:bg-gray-200 px-3 py-2 rounded flex items-center"
              >
                <RemoveIcon /> Remove
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={onAddIngredient}
          className="mt-4 border border-dashed border-[#d4b092] text-[#e28044] bg-[#fdf9f6] hover:bg-[#fceee5] px-4 py-1.5 rounded-md text-sm inline-flex items-center gap-1.5 transition-colors"
        >
          <PlusIcon /> Add ingredient
        </button>
      </div>
    </CardSection>
  );
}
