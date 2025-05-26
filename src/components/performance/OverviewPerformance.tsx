export default function OverviewPerformance() {
    const stats = [
        { label: "Average Time per Question", value: "12 min 30 sec" },
        { label: "Total Time Spent", value: "45 hours" },
        { label: "Questions Attempted", value: "225" },
    ];

    return (
        <section className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Overall Performance
            </h2>

            {/* Outer “card” wrapper to match your other charts */}
            <div className="bg-[#F6FBF7] border border-[#E0EBE4] rounded-lg p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {stats.map(({ label, value }) => (
                        <div
                            key={label}
                            className="
                bg-white
                border border-green-200
                rounded-lg
                p-6
                flex flex-col justify-center items-center
                space-y-1
              "
                        >
                            <p className="text-sm text-gray-600">{label}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
