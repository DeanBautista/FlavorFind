export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  highlighted = false,
  name,
  errorMessage
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 rounded-full text-sm text-gray-600 bg-white outline-none transition-colors
          ${
            errorMessage
              ? "border-2 border-red-500 focus:border-red-500"
              : highlighted
              ? "border-2 border-orange-500 focus:border-orange-500"
              : "border border-gray-200 focus:border-orange-400"
          }`}
      />

      {errorMessage && (
        <p className="mt-1 ml-4 text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}