export default function Textarea({
  name,
  value,
  onChange,
  placeholder,
  maxLength,
}) {
  return (
    <div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea6424] focus:border-transparent transition-all placeholder-gray-400 bg-white min-h-[60px]"
        rows={3}
      />
      {maxLength && (
        <div className="text-right text-xs text-gray-400 mt-1">
          {(value || "").length}/{maxLength}
        </div>
      )}
    </div>
  );
}
