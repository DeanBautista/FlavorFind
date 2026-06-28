// components/PageLoader.jsx
export default function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf7f2]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-sm text-gray-400 font-medium">Loading...</span>
      </div>
    </div>
  );
}