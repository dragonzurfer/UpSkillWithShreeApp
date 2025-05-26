export default function QuestionStatusChart() {
    // Data for the vertical bars
    const questionStatusData = [
        { label: "Correct", percentageHeight: "85%", value: 150 },
        { label: "Incorrect", percentageHeight: "30%", value: 45 },
        { label: "Skipped", percentageHeight: "70%", value: 30 },
    ];

    // Calculate total
    const totalQuestions = questionStatusData.reduce((sum, x) => sum + x.value, 0);

    // Y-axis markers
    const yAxisMarkers = ['100%', '75%', '50%', '25%', '0%'];

    return (
        <div className="bg-[#F6FBF7] rounded-lg border border-[#E0EBE4] p-6 shadow-sm">
            {/* Header */}
            <p className="text-xs font-medium text-gray-500 mb-1">Question Status</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Total: {totalQuestions}</h2>
            <p className="text-sm text-[#4CAF50] font-medium mb-6">All Time</p>

            {/* Chart */}
            <div className="flex">
                {/* Y-Axis */}
                <div className="flex flex-col justify-between h-40 text-xs font-medium text-gray-400 text-right pr-3 shrink-0">
                    {yAxisMarkers.map(m => <span key={m}>{m}</span>)}
                </div>

                {/* Bars */}
                <div className="flex flex-1 items-end h-40 gap-x-3 sm:gap-x-4">
                    {questionStatusData.map(({ label, percentageHeight }) => (
                        <div
                            key={label}
                            className="relative flex-1"
                            style={{ height: percentageHeight }}
                        >
                            {/* Percentage label at the top */}
                            <span
                                className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700"
                            >
                                {percentageHeight}
                            </span>

                            {/* Actual bar */}
                            <div className="h-full bg-[#EAF3ED] border-t-2 border-gray-700 flex flex-col justify-end items-center pb-1.5">
                                <span className="text-xs font-medium text-[#4CAF50]">{label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
