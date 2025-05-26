// Data for the bars — adjust percentages as needed
const difficultyData = [
    { label: "Easy", percentage: "25%", color: "bg-[#E0F2E9]" },
    { label: "Medium", percentage: "55%", color: "bg-[#E0F2E9]" },
    { label: "Hard", percentage: "85%", color: "bg-[#E0F2E9]" },
];

export default function PerformanceByDifficulty() {
    const totalQuestions = 225; // could come from props/state

    return (
        <div className="bg-[#F6FBF7] rounded-lg border border-[#E0EBE4] p-6 shadow-sm">
            <p className="text-xs font-medium text-gray-500 mb-1">
                Questions Attempted by Difficulty
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Total: {totalQuestions}
            </h2>
            <p className="text-sm text-[#4CAF50] font-medium mb-6">
                All Time
            </p>

            <div className="space-y-4">
                {difficultyData.map(({ label, percentage, color }) => (
                    <div key={label} className="flex items-center">
                        {/* Difficulty label */}
                        <span className="w-20 text-sm font-medium text-gray-700 flex-shrink-0 mr-3">
                            {label}
                        </span>

                        {/* Bar track */}
                        <div className="flex-grow h-5">
                            {/*
                - Make the filled portion a flex container
                - justify-center & items-center to center the text inside it
              */}
                            <div
                                className={`${color} h-full rounded flex items-center justify-center`}
                                style={{ width: percentage }}
                            >
                                <span className="text-xs font-medium text-gray-700">
                                    {percentage}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
