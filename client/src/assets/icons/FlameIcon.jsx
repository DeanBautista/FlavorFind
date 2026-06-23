export default function FlameIcon({ className = "w-4 h-4" }) {
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
      <path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c2 2 2 5 0 8a7 7 0 0 1-12 0c-2-4 0-7 2-9 0 2 1 3 2 3 1-1 1-3 2-9z" />
    </svg>
  );
}