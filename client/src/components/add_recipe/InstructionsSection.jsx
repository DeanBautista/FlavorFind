import { PlusIcon, RemoveIcon } from "../../assets/icons/Icons";
import Textarea from './TextArea';
import CardSection from './CardSection';

export default function InstructionsSection({ instructions, onInstructionChange, onAddInstruction, onRemoveInstruction }) {
  return (
    <CardSection title="Instructions" icon={<span className="text-lg">📄</span>}>
      <div className="space-y-4">
        {instructions.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-start gap-3">
            <div className="flex-1 w-full">
              <Textarea
                value={item.text}
                onChange={(e) => onInstructionChange(item.id, e.target.value)}
                placeholder="Describe the step..."
              />
            </div>
            <button
              onClick={() => onRemoveInstruction(item.id)}
              className="text-xs bg-[#f3f3f3] text-gray-500 hover:bg-gray-200 px-3 py-2 rounded flex items-center whitespace-nowrap mt-1"
            >
              <RemoveIcon /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={onAddInstruction}
          className="mt-2 border border-dashed border-[#d4b092] text-[#e28044] bg-[#fdf9f6] hover:bg-[#fceee5] px-4 py-1.5 rounded-md text-sm inline-flex items-center gap-1.5 transition-colors"
        >
          <PlusIcon /> Add step
        </button>
      </div>
    </CardSection>
  );
}