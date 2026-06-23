import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { updateUser, uploadImage } from "../../api/userApi";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    username: user.username || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setAvatarUploading(true);
    setError("");

    try {
      const { url } = await uploadImage(file);
      setForm((prev) => ({ ...prev, avatar: url }));
      setAvatarPreview(url);
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError("Image upload failed. Please try again.");
      setAvatarPreview(user.avatar || "");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const data = await updateUser(user._id, {
        username: form.username.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar.trim(),
      });
      onSave(data.user ?? data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${form.username || "U"}`;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(28, 25, 23, 0.5)",
        backdropFilter: "blur(2px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
          <h2 id="edit-profile-title" className="text-lg font-bold text-stone-900">
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <img
                  src={avatarPreview || fallbackAvatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-400"
                  onError={(e) => {
                    e.currentTarget.src = fallbackAvatar;
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-50"
                  aria-label="Change avatar"
                >
                  {avatarUploading ? (
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>
              {avatarUploading && <p className="text-xs text-stone-400">Uploading...</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={30}
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1" htmlFor="bio">
                Bio
                <span className="ml-1 font-normal text-stone-400">({form.bio.length}/300)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                maxLength={300}
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell the community a little about yourself..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          </div>

          <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || avatarUploading || !form.username.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-400 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
