import { useState, useEffect, useRef } from "react"
import useAuth from "../../context/useAuth"
import { LogoutIcon, UserIcon } from "../../assets/icons/Icons"
import { useNavigate } from "react-router-dom"

function ProfileDropdown({ onClose, user }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?"

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-gray-200 rounded-xl shadow-md min-w-[176px] z-50 overflow-hidden">
      
      {/* Avatar + username header */}
      {user && (
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          <span className="text-sm font-semibold text-gray-900 truncate">
            {user.username}
          </span>
        </div>
      )}

      <button
        onClick={() => { navigate("/profile"); onClose(); }}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <UserIcon />
        View profile
      </button>
      <div className="h-px bg-gray-100" />
      <button
        onClick={() => { onClose(); logout(); }}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogoutIcon />
        Log out
      </button>
    </div>
  )
}

export default function AvatarButton() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="relative flex-shrink-0" ref={wrapRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Open profile menu"
        className={`w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors ${
          open ? "bg-gray-100 text-gray-900" : ""
        }`}
      >
        <UserIcon width="6" height="6" />
      </button>
      {open && <ProfileDropdown onClose={() => setOpen(false)} user={user} />}
    </div>
  )
}