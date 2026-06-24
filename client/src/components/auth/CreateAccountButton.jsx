import { UserPlusIcon } from "../../assets/icons/Icons";

export default function CreateAccountButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700
        text-white font-semibold text-sm rounded-full py-3.5 transition-colors"
    >
      <UserPlusIcon />
      Create account
    </button>
  );
}
