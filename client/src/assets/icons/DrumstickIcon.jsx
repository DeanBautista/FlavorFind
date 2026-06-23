export default function DrumstickIcon({ className = "w-4 h-4" }) {
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
      <path d="M15.5 8.5c2 2 2.5 5 .5 7s-5-1.5-7-3.5-4.5-6.5-2.5-8.5 5.5-.5 7.5 1.5z" />
      <path d="M5 19l3-3" />
      <circle cx="4" cy="20" r="1.5" />
    </svg>
  );
}