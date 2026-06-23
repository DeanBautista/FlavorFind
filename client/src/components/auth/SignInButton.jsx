export default function SignInButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-12 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
    >
      {/* arrow-right icon or login icon here */}
      → Log in
    </button>
  );
}