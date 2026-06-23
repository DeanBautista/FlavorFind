export default function Hero({ title, image }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: "380px", height: "32vh" }}
    >
      <img
        src={image || "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1800&auto=format&fit=crop"}
        alt={title || "Recipe"}
        className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-[1232px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-sm animate-title-reveal">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}