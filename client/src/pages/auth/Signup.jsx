import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "../../components/auth/InputField";
import Divider from "../../components/auth/Divider";
import TermsCheckbox from "../../components/auth/TermsCheckbox";
import LoginLink from "../../components/auth/LoginLink";

import { LogoIcon } from "../../assets/icons/Icons";
import { createUser } from "../../api/userApi";
import useAuth from "../../context/useAuth";

function Logo() {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shadow-sm">
        <LogoIcon />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight leading-none select-none">
          <span className="text-orange-500">flavor</span>
          <span className="text-gray-800">find</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">Start your culinary journey today</p>
      </div>
    </div>
  );
}

function CreateAccountButton({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full mt-2 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-full"
    >
      {isLoading ? (
        <>
          <svg
            className="w-4 h-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Creating account…
        </>
      ) : (
        "Create account"
      )}
    </button>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [errors, setErrors] = useState({ username: null, email: null, password: null });
  const [isLoading, setIsLoading] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async () => {
    if (!form.agreed) { alert("Please agree to the Terms of Service and Privacy Policy."); return; }
    if (form.password !== form.confirmPassword) { alert("Passwords do not match."); return; }

    setIsLoading(true);
    try {
      const response = await createUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(response);
      navigate("/home");
    } catch (error) {
      if (error.inputType) {
        setErrors((prev) => ({ ...prev, [error.inputType]: error.message }));
      } else {
        setErrors((prev) => ({ ...prev, password: error.message || "An error occurred" }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6 max-[800px]:p-0">
      <div className="animate-fade-in-up bg-white rounded-2xl w-full max-w-lg px-8 py-10 shadow-sm max-[800px]:max-w-none max-[800px]:rounded-none max-[800px]:min-h-screen max-[800px]:flex max-[800px]:flex-col max-[800px]:justify-start">
        <Logo />

        <InputField
          label="Username"
          name="username"
          placeholder="@alexchef"
          value={form.username}
          onChange={set("username")}
          errorMessage={errors.username}
        />
        <InputField
          label="Email address"
          type="email"
          name="email"
          placeholder="hello@flavorfind.com"
          value={form.email}
          onChange={set("email")}
          errorMessage={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
          errorMessage={errors.password}
        />
        <InputField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          highlighted={!!form.confirmPassword}
        />

        <TermsCheckbox checked={form.agreed} onChange={set("agreed")} />

        <CreateAccountButton onClick={handleSubmit} isLoading={isLoading} />

        <Divider msg="Already have an account?" />

        <LoginLink onClick={() => navigate("/signin")} />
      </div>
    </div>
  );
}