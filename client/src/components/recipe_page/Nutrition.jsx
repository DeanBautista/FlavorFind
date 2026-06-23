import {
    AppleIcon,
    FlameIcon,
    DrumstickIcon,
    WheatIcon,
    DropletIcon,
} from "../../assets/icons/Icons"

function NutritionItem({ icon, label, value }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-sm text-gray-700">
            <span className="text-orange-500">{icon}</span>
            <span>
            {label}: <span className="font-medium text-gray-900">{value}</span>
            </span>
        </span>
    )
}

export default function Nutrition({ nutrition = {} }) {
    const { calories, protein, carbs, fat } = nutrition;

    return(
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-5 sm:px-6 py-4 sm:py-5">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 text-base mb-3">
            <span className="text-red-500">
                <AppleIcon className="w-5 h-5" />
            </span>
            Nutrition (per serving)
            </h3>
            <div className="flex flex-wrap gap-2">
            {calories != null && (
                <NutritionItem icon={<FlameIcon className="w-4 h-4" />} label="Calories" value={`${calories} kcal`} />
            )}
            {protein != null && (
                <NutritionItem icon={<DrumstickIcon className="w-4 h-4" />} label="Protein" value={`${protein}g`} />
            )}
            {carbs != null && (
                <NutritionItem icon={<WheatIcon className="w-4 h-4" />} label="Carbs" value={`${carbs}g`} />
            )}
            {fat != null && (
                <NutritionItem icon={<DropletIcon className="w-4 h-4" />} label="Fat" value={`${fat}g`} />
            )}
            </div>
        </div>
    )
}