import { getServerSession } from "next-auth/next";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ProtectedNavbar from "@/components/ProtectedNavbar";
import NextAuthProvider from "@/components/NextAuthProvider";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await getServerSession(authOptions);

  // If no session or token expired, redirect to login page
  if (!session || isTokenExpired(session)) {
    redirect('/login');
  }

  console.log("hello");

  // If session exists, render the providers and children
  return (
    <NextAuthProvider session={session}>
      <ProtectedNavbar />
      <main>{children}</main>
    </NextAuthProvider>
  );
}

// Helper function to check if token is expired
function isTokenExpired(session: any): boolean {
  if (!session?.idToken) return true;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const payload = session.idToken.split('.')[1];
    if (!payload) return true;
    
    // Decode the base64 payload
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    // Check expiration (exp is in seconds)
    const expiryTime = decodedPayload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch (error) {
    // If any error in parsing, consider token invalid
    console.error('Error checking token expiration:', error);
    return true;
  }
} 