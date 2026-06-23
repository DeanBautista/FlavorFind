export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer select-none group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-2 border-gray-300 text-orange-500 accent-orange-500 cursor-pointer focus:ring-2 focus:ring-orange-400 focus:ring-offset-1"
      />
      <span className="text-[15px] text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}
