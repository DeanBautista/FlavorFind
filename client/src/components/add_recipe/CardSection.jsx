export default function CardSection({
  title,
  icon,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 md:p-8 mb-6 w-full ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 mb-5">
          <span className="text-[#515151]">{icon}</span>
          <h3 className="text-[#464646] text-lg font-medium">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
}