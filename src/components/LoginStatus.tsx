'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  if (session) {
    return (
      <div className="flex flex-col">
        <p className="text-sm font-medium">{session.user?.email}</p>
        {/* Optional: Display user image */}
        {/* {session.user?.image && (
          <img src={session.user.image} alt="User image" width={50} height={50} />
        )} */}
        <button 
          onClick={() => signOut()} 
          className="text-xs text-gray-500 hover:text-gray-700 mt-1"
          data-testid="sign-out-button"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-500">Not signed in</p>
      <button 
        onClick={() => signIn('google')} 
        className="text-xs text-[#5DD62C] hover:text-green-500 mt-1"
      >
        Sign in with Google
      </button>
    </div>
  );
} 