export default function BookOpenIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 5c2-1 5-1 7 0v14c-2-1-5-1-7 0V5z" />
      <path d="M21 5c-2-1-5-1-7 0v14c2-1 5-1 7 0V5z" />
    </svg>
  );
}