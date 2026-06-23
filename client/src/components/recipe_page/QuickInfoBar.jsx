import {
    ClockIcon,
    UserIcon,
    TrendingUpIcon
} from "../../assets/icons/Icons"

function MetaItem({ icon, label, className = "" }) {
    return(
        <div className={"flex items-center gap-1.5 text-gray-700 " + className}>
            <span className="text-orange-500">{icon}</span>
            <span className="text-sm">{label}</span>
        </div>
    )
}

function Pill({ children, className = "" }) {
    return (
        <span
            className={
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 " +
            className
            }
        >
            {children}
        </span>
    )
}

export default function QuickInfoBar({ prepTime, cookTime, servings, difficulty, categories = [] }) {
   return (
    <div className="bg-white rounded-full border border-gray-100 shadow-sm px-5 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <MetaItem icon={<ClockIcon className="w-4 h-4" />} label={`Cook: ${cookTime} min`} />
        <MetaItem icon={<ClockIcon className="w-4 h-4" />} label={`Prep: ${prepTime} min`} />
        <MetaItem icon={<UserIcon className="w-4 h-4" />} label={`Serves: ${servings}`} />
        <MetaItem
            icon={<TrendingUpIcon className="w-4 h-4" />}
            label={`Difficulty: ${difficulty}`}
        />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
        {categories.map((cat) => (
            <Pill key={cat}>{cat}</Pill>
        ))}
        </div>
    </div>
   )
}