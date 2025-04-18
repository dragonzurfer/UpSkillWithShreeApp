'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16 mx-auto">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. This area is restricted to administrators.
        </p>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => router.back()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Go Back
          </button>
          <Link 
            href="/"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 