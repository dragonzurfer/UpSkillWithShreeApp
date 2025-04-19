'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Client component that uses useSearchParams
function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  return (
    <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-md">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-8 space-y-6">
        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

// Fallback for Suspense
function LoginFormFallback() {
  return (
    <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-md">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-8 space-y-6">
        <div className="group relative flex w-full justify-center rounded-md bg-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-400">
          Loading...
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
} 