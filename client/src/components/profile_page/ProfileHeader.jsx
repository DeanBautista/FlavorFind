import { Calendar, Pencil } from "lucide-react";

export default function ProfileHeader({ user, avatarSrc, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-5 sm:gap-6">
        <img
          src={avatarSrc}
          alt={user.username}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-orange-400 flex-shrink-0"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{user.username}</h1>
          <p className="text-orange-500 font-medium mt-0.5">@{user.username}</p>
          {user.bio && (
            <p className="text-stone-600 mt-2 max-w-xl mx-auto sm:mx-0">{user.bio}</p>
          )}
          {user.createdAt && (
            <p className="inline-flex items-center gap-1.5 text-sm text-stone-400 mt-2">
              <Calendar className="w-3.5 h-3.5" />
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="mt-4 inline-flex items-center gap-2 bg-[#f3e7d9] hover:bg-[#ecdbc7] text-stone-800 text-sm font-medium px-4 py-2 rounded-full transition-colors w-fit"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
