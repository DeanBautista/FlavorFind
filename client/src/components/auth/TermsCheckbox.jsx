export default function TermsCheckbox({ checked, onChange }) {
  return (
    <div className="flex items-start gap-2.5 my-4">
      <input
        type="checkbox"
        id="terms"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer flex-shrink-0"
      />
      <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer leading-snug">
        I agree to the{" "}
        <a href="#" className="text-orange-500 font-medium hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-orange-500 font-medium hover:underline">
          Privacy Policy
        </a>
      </label>
    </div>
  );
}