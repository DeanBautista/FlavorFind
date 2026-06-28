import { useNavigate } from "react-router-dom";
import { LogoIcon } from "../assets/icons/Icons";

// ─── Brand wordmark (matches Header) ───────────────────────────────────────
function Wordmark() {
  return (
    <span className="text-xl font-bold tracking-tight leading-none select-none">
      <span className="text-orange-500">flavor</span>
      <span className="text-gray-800">find</span>
    </span>
  );
}

const exploreLinks = [
  { label: "Discover", path: "/home" },
  { label: "Categories", path: "/categories" },
  { label: "About Us", path: "/about" },
  { label: "Browse Recipes", path: "/search" },
  { label: "Share a Recipe", path: "/addrecipe" },
];

// ─── Footer ─────────────────────────────────────────────────────────────────
export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-white border-t border-gray-100 font-sans">
      <div className="mx-auto w-full px-4 sm:px-6 py-6" style={{ maxWidth: "1280px" }}>

        {/* ── Single row: brand+description on the left, Explore links on the right ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* Brand */}
          <div className="flex flex-col gap-1.5 max-w-sm">
            <div
              className="flex items-center gap-2 cursor-pointer w-fit"
              onClick={() => navigate("/home")}
            >
              <LogoIcon />
              <Wordmark />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              A home for home cooks — discover, save, and share recipes you'll love.
            </p>
          </div>

          {/* Explore */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {exploreLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="text-xs font-medium text-gray-500 hover:text-orange-500 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ── All rights reserved ── */}
        <div className="border-t border-gray-100 mt-4 pt-3">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            © {new Date().getFullYear()} flavorfind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}