import {
  CarrotIcon
} from "../../assets/icons/Icons";

export default function IngredientsCard({ ingredients = [], stacked = false }) {
  return (
    <div
      className={
        "bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-6 py-5 sm:py-6 " +
        (stacked ? "w-full" : "w-full")
      }
    >
      <h3 className="flex items-center gap-2 font-bold text-gray-900 text-lg mb-4">
        <CarrotIcon className="w-5 h-5 text-gray-800" />
        Ingredients
      </h3>

      <ul className="flex flex-col gap-3.5">
        {ingredients.map((item, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-gray-400" />
            <span className="text-gray-700">
              {[item.amount, item.unit, item.name].filter(Boolean).join(" ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}