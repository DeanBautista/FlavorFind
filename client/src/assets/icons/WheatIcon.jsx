export default function WheatIcon({ className = "w-4 h-4" }) {
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
      <path d="M12 22V12" />
      <path d="M9 9l3 3 3-3" />
      <path d="M9 5l3 3 3-3" />
      <path d="M7 12l5 5 5-5" />
    </svg>
  );
}