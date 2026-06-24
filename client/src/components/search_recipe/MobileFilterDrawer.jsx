import FilterPanelContent from "./FilterPanelContent";
import { CloseIcon } from "../../assets/icons/Icons";

export default function MobileFilterDrawer({ open, onClose, filterPanelProps }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 w-[358px] max-w-[90vw] bg-white shadow-2xl overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-600"
            aria-label="Close filters"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <FilterPanelContent {...filterPanelProps} />
      </div>
    </div>
  );
}
