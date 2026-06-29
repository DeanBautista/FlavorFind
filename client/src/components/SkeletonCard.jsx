export default function SkeletonCard({ className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse ${className}`}>
      <div className="w-full bg-gray-100" style={{ paddingBottom: "62%" }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full" />
      </div>
    </div>
  );
}