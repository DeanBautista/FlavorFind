import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CloseIcon, 
    LogoIcon, 
    MenuIcon,
    SearchIcon,
} from "../../assets/icons/Icons"
import AvatarButton from "./AvatarButton";

// Brand wordmark
function Wordmark() {
  return (
    <span className="text-xl font-bold tracking-tight leading-none select-none">
      <span className="text-orange-500">flavor</span>
      <span className="text-gray-800">find</span>
    </span>
  );
}

// Desktop nav links
const navLinks = [
  { label: "Discover",   path: "/home" },
  { label: "Categories", path: "/categories" },
  { label: "About Us",   path: "/about" },
];

export default function Header() {

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div
        className="mx-auto w-full flex flex-col px-4 sm:px-6"
        style={{ maxWidth: "1280px" }}
      >
        {/* ── DESKTOP NAV (lg and up) ── */}
        <div className="hidden lg:flex items-center justify-between gap-4 h-16">

          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <LogoIcon />
            <Wordmark />
          </div>

          {/* Search bar */}
          <div className="flex-1 grow max-w-xs lg:max-w-sm mx-4">
            <div
              onClick={() => navigate("/search")}
              className="flex items-center bg-gray-100 rounded-full px-3.5 py-2 gap-2 hover:bg-gray-150 transition-colors cursor-pointer"
            >
              <SearchIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                readOnly
                onFocus={() => navigate("/search")}
                placeholder="Search recipes..."
                className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* CTA + Avatar */}
          <div className="flex items-center gap-3 ml-2">
            <button 
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-full"
              onClick={() => {navigate("/addrecipe")}}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Recipe
            </button>
            <AvatarButton />
          </div>
        </div>

        {/* ── MOBILE / TABLET NAV (below lg) ── */}
        <div className="flex lg:hidden items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <LogoIcon />
            <Wordmark />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => navigate("/search")}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Go to search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            {/* Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Avatar with dropdown (mobile) */}
            <AvatarButton />
          </div>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t absolute w-full border-gray-100 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.label}
                  onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-gray-100 mt-1 flex items-center justify-between">
              <button 
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-full"
                onClick={() => {navigate("/addrecipe")}}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Recipe
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}