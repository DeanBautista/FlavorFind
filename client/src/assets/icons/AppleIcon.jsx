export default function AppleIcon({ className = "w-5 h-5" }) {
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
      <path d="M12 7c-1-2-3-3-5-2 0 3 1 5 2 6-2 0-4 2-4 5 0 4 3 7 6 7 1.5 0 2-0.5 3-0.5s1.5 0.5 3 0.5c3 0 6-3 6-7 0-3-2-5-4-5 1-1 2-3 2-6-2-1-4 0-5 2" />
    </svg>
  );
}