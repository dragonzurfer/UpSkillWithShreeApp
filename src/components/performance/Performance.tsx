import OverviewPerformance from "./OverviewPerformance";
import PerformanceByTag from "./PerformanceByTag";
import PerformanceByDifficulty from "./PerformanceByDifficulty";
import TotalTime from "./TotalTime";

export default function Dashboard() {
    return (
        <main className="min-h-screen p-6">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Overall Performance Card */}
                <OverviewPerformance />

                {/* Performance by Tag Card */}
                <section className="p-6 rounded-lg">
                    <PerformanceByTag />
                </section>

                {/* Performance by Difficulty Card */}
                <section className="p-6 rounded-lg">
                    <PerformanceByDifficulty />
                </section>

                {/* Question Breakdown Card */}
                <section className="p-6 rounded-lg">
                    <TotalTime />
                </section>
            </div>
        </main>
    );
}
