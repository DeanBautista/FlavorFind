export default function CarrotIcon({ className = "w-5 h-5" }) {
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
      <path d="M14 9c3-1 6 1 6 3s-2 2-3 1c1 2 0 4-2 4-3 0-6-4-6-7 0-2 2-3 5-1z" />
      <path d="M17 7l1.5-1.5" />
      <path d="M19 9l1.5-1.5" />
      <path d="M3 21l4-4" />
    </svg>
  );
}