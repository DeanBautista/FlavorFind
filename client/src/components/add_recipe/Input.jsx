export default function Input({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea6424] focus:border-transparent transition-all placeholder-gray-400 bg-white"
    />
  );
}