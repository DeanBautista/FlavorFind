import Input from './Input';
import FormLabel from './FormLabel';
import CardSection from './CardSection';

export default function NutritionSection({ formData, numericErrors, onInputChange }) {
  return (
    <CardSection title="Nutrition (optional)" icon={<span className="text-lg">🍎</span>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <FormLabel>Calories (kcal)</FormLabel>
          <Input name="calories" value={formData.calories} onChange={onInputChange} placeholder="e.g., 420" />
          {numericErrors.calories && (
            <p className="text-red-500 text-xs mt-1">{numericErrors.calories}</p>
          )}
        </div>
        <div>
          <FormLabel>Protein (g)</FormLabel>
          <Input name="protein" value={formData.protein} onChange={onInputChange} placeholder="e.g., 18" />
          {numericErrors.protein && (
            <p className="text-red-500 text-xs mt-1">{numericErrors.protein}</p>
          )}
        </div>
        <div>
          <FormLabel>Carbs (g)</FormLabel>
          <Input name="carbs" value={formData.carbs} onChange={onInputChange} placeholder="e.g., 55" />
          {numericErrors.carbs && (
            <p className="text-red-500 text-xs mt-1">{numericErrors.carbs}</p>
          )}
        </div>
        <div>
          <FormLabel>Fat (g)</FormLabel>
          <Input name="fat" value={formData.fat} onChange={onInputChange} placeholder="e.g., 22" />
          {numericErrors.fat && (
            <p className="text-red-500 text-xs mt-1">{numericErrors.fat}</p>
          )}
        </div>
      </div>
    </CardSection>
  );
}