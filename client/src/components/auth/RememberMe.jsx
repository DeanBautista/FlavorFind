export default function RememberMe({ checked, onChange }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 accent-orange-500 cursor-pointer"
        />
        Remember me
      </label>
      <button
        type="button"
        onClick={() => alert("Navigate to forgot password")}
        className="text-sm text-orange-500 font-medium hover:underline"
      >
        Forgot password?
      </button>
    </div>
  );
}