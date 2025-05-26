// File: app/results/[testId]/[responseId]/page.tsx (or a similar route depending on your routing setup)

'use client';

import { useState } from 'react';
import ResultsPage from '@/components/ResultsPage';
import PerformancePage from '@/components/performance/Performance';

export default function ResultsWithTabs() {
    const [activeTab, setActiveTab] = useState<'results' | 'performance'>('results');

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        className={`py-2 px-4 font-medium border-b-2 transition duration-200 ease-in-out ${activeTab === 'results'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        onClick={() => setActiveTab('results')}
                    >
                        Results
                    </button>
                    <button
                        className={`py-2 px-4 font-medium border-b-2 transition duration-200 ease-in-out ${activeTab === 'performance'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Performance
                    </button>
                </nav>
            </div>

            <div>
                {activeTab === 'results' && <ResultsPage />}
                {activeTab === 'performance' && <PerformancePage />}
            </div>
        </div>
    );
}
