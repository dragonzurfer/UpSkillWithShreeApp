const tags = [
    { name: "Dynamic Programming", time: "15 hours", attempts: 75 },
    { name: "Data Structures", time: "10 hours", attempts: 50 },
    { name: "Algorithms", time: "8 hours", attempts: 40 },
    { name: "Graphs", time: "7 hours", attempts: 35 },
    { name: "Recursion", time: "5 hours", attempts: 25 },
];

export default function PerformanceByTag() {
    return (
        // Added a wrapper div for overall component padding if needed, can be adjusted/removed.
        <div className="p-1"> {/* Minimal padding to ensure rounded corners are visible against page background */}
            <h2 className="text-lg font-semibold mb-5 text-gray-800">Performance by Tag</h2>
            <div className="overflow-x-auto">
                {/* This new div wraps the table to apply overall background, border, and rounded corners */}
                <div className="bg-[#f8fcfa] rounded-lg border border-[#E0EBE4] overflow-hidden shadow-sm">
                    <table className="min-w-full text-sm">
                        {/* Thead with a more distinct bottom border */}
                        <thead className="border-b-2 border-[#f8fcfa]">
                            <tr>
                                {["Tag", "Time Spent", "Questions Attempted"].map(h => (
                                    <th
                                        key={h}
                                        // Adjusted padding, text style for headers
                                        className="py-3 px-6 text-left text-xs font-normal text-gray-500"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tags.map(tag => (
                                <tr
                                    key={tag.name}
                                    // Row border, last row no border, and hover effect
                                    className="border-b border-[#f8fcfa] last:border-b-0 hover:bg-[#E6F4EA]"
                                >
                                    {/* Tag Name: Darker text, medium weight */}
                                    <td className="py-4 px-6 text-gray-800 font-medium whitespace-nowrap">
                                        {tag.name}
                                    </td>
                                    {/* Time Spent: Specific green color */}
                                    <td className="py-4 px-6 text-[#4CAF50] whitespace-nowrap">
                                        {tag.time}
                                    </td>
                                    {/* Questions Attempted: Standard dark text */}
                                    <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                                        {tag.attempts}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}