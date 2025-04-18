'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

const ProtectedNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#1F2937] to-[#374151] text-white p-4 mb-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          {/* Logo with gradient */}
          <div className="h-10 flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00A02B] to-[#5DD62C] text-transparent bg-clip-text">
              UpSkillWithShree
            </h1>
          </div>
        </Link>
        
        <div className="flex items-center">
          {/* Navigation Links */}
          <div className="flex items-center mr-6">
            <Link 
              href="/" 
              className={`px-4 py-2 transition-all duration-150 opacity-70 hover:opacity-100 relative ${
                pathname === '/' ? 'opacity-100' : ''
              }`}
            >
              Home
              {pathname === '/' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5DD62C]"></div>
              )}
            </Link>
            
            <Link 
              href="/diagnostic-tests" 
              className={`px-4 py-2 transition-all duration-150 opacity-70 hover:opacity-100 relative ${
                pathname === '/diagnostic-tests' ? 'opacity-100' : ''
              }`}
            >
              Tests
              {pathname === '/diagnostic-tests' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5DD62C]"></div>
              )}
            </Link>
            
            {/* Add more links as needed */}
          </div>
          
          {/* User Profile Menu */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-full p-2 min-h-[44px] min-w-[44px]"
            >
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                {session?.user?.email ? session.user.email[0].toUpperCase() : '?'}
              </div>
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  {session?.user?.email}
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </div>
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </div>
                </a>
                <button 
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProtectedNavbar; 