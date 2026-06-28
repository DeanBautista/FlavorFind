import Input from './Input';
import FormLabel from './FormLabel';
import CardSection from './CardSection';

export default function TimeServingsSection({ formData, numericErrors, onInputChange }) {
  return (
    <CardSection title="Time & Servings" icon={<span className="text-lg">🕒</span>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <FormLabel>Prep time (mins)</FormLabel>
          <Input name="prepTime" value={formData.prepTime} onChange={onInputChange} placeholder="15" />
          {numericErrors.prepTime && (
            <p className="text-red-500 text-xs mt-1">{numericErrors.prepTime}</p>
          )}
        </div>
        <div>
          <FormLabel required>Cook time (mins)</FormLabel>
          <Input name="cookTime" value={formData.cookTime} onChange={onInputChange} placeholder="30" />
          {numericErrors.cookTime && (
            <p className="text-red-500 text-xs mt-1">{numericErrors.cookTime}</p>
          )}
        </div>
        <div>
          <FormLabel>Servings</FormLabel>
          <Input name="servings" value={formData.servings} onChange={onInputChange} placeholder="4" />
          {numericErrors.servings && (
            <p className="text-red-500 text-xs mt-1">{numericErrors.servings}</p>
          )}
        </div>
      </div>
    </CardSection>
  );
}