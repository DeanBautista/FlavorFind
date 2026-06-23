import {
    BookOpenIcon
} from "../../assets/icons/Icons"

function InstructionStep({ n, text }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm pl-5 pr-5 sm:pl-6 sm:pr-6 py-4 border-l-4 border-l-orange-500">
            <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Step {n}
            </span>
            <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
    )
}

export default function Instructions({ steps = [] }) {
    return (
        <div>
            <h3 className="flex items-center gap-2 font-bold text-gray-900 text-xl mb-4">
            <BookOpenIcon className="w-5 h-5 text-gray-800" />
            Instructions
            </h3>
            <div className="flex flex-col gap-3">
            {steps.map((s) => (
                <InstructionStep key={s.stepNumber} n={s.stepNumber} text={s.instruction} />
            ))}
            </div>
        </div>
    )
}