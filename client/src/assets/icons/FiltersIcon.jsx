export default function FiltersIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="20" y2="12" />
      <line x1="10" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="7" cy="18" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
