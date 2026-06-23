export default function SignupLink({ onClick }) {
  return (
    <p className="text-center text-sm text-gray-400">
      Don't have an account?{" "}
      <button type="button" onClick={onClick} className="text-orange-500 font-medium cursor-pointer hover:underline">
        Create an account
      </button>
    </p>
  );
}