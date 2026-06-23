export default function CreateAccountButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700
        text-white font-semibold text-sm rounded-full py-3.5 transition-colors"
    >
      {/* User-plus icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM6 21a8 8 0 0 1 16 0"
        />
        <line x1="19" y1="8" x2="19" y2="14" strokeLinecap="round" />
        <line x1="16" y1="11" x2="22" y2="11" strokeLinecap="round" />
      </svg>
      Create account
    </button>
  );
}