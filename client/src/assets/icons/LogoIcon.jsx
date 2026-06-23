export default function LogoIcon() {
  return (
    <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 2v7c0 1.657 1.343 3 3 3s3-1.343 3-3V2" />
        <path d="M6 2v20" />
        <path d="M21 2v20" />
        <path d="M21 7H17a2 2 0 01-2-2V2" />
      </svg>
    </div>
  );
}