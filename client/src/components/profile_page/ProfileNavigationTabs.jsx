import profileTabItems from "./profileTabItems";

export default function ProfileNavigationTabs({
  activeTab,
  onTabChange,
  visibleTabs,
  isOwnProfile,
}) {
  const visibleItems = visibleTabs
    ? profileTabItems.filter((tab) => visibleTabs.includes(tab.key))
    : profileTabItems;

  return (
    <div className="flex border-b border-stone-200 px-2 sm:px-6">
      {visibleItems.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        // Strip "My " prefix when viewing someone else's profile
        const label = isOwnProfile
          ? tab.label
          : tab.label.replace(/^My /, "");

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? "text-orange-500 border-orange-500"
                : "text-stone-500 border-transparent hover:text-stone-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}