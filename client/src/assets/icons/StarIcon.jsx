export default function StarIcon({ filled, half, className = "w-5 h-5" }) {
  const id = `half-${Math.random().toString(36).slice(2)}`;

  return (
    <svg viewBox="0 0 24 24" className={className}>
      {half && (
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2.5l2.97 6.46 6.93.74-5.2 4.86 1.44 6.94L12 17.9l-6.14 3.5 1.44-6.94-5.2-4.86 6.93-.74L12 2.5z"
        fill={half ? `url(#${id})` : filled ? "#FB923C" : "none"}
        stroke={filled || half ? "#FB923C" : "#D1D5DB"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}