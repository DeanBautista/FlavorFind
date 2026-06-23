export default function FormLabel({ children, required }) {
  return (
    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-[#ea6424] ml-1">*</span>}
    </label>
  );
}