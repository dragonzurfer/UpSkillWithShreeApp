'use client';

import { useParams } from 'next/navigation';

export default function TestResultsPage() {
  const params = useParams();
  const testId = params.testId;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Results for Test: {testId}</h1>
      <p>This is where the test results will be displayed.</p>
      {/* Placeholder for results content */}
    </div>
  );
} 