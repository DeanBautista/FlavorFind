export default function LeafIcon({ className = "w-4 h-4" }) {
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
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 6 0 9 4 9 9a7 7 0 0 1-7 7H11z" />
      <path d="M4 13c4 0 9 4 9 9" />
    </svg>
  );
}