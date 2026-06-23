export default function LoginLink({ onClick }) {
  return (
    <p className="text-center text-sm text-gray-400">
      Already have an account?{" "}
      <button type="button" onClick={onClick} className="text-orange-500 font-medium cursor-pointer hover:underline">
        Sign in
      </button>
    </p>
  );
}