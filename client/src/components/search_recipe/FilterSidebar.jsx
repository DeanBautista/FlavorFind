import FilterPanelContent from "./FilterPanelContent";

export default function FilterSidebar({ filterPanelProps }) {
  return (
    <aside className="max-[850px]:hidden w-[260px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Filter</h2>
      <FilterPanelContent {...filterPanelProps} />
    </aside>
  );
}
