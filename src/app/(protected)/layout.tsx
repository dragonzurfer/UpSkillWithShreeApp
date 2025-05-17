import { getServerSession } from "next-auth/next";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import ProtectedNavbar from "@/components/ProtectedNavbar";
import NextAuthProvider from "@/components/NextAuthProvider";
import { redirect } from "next/navigation";
import "katex/dist/katex.min.css";

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
  // First check if there was a refresh token error
  if (session?.error === "RefreshAccessTokenError") {
    console.log("Token refresh error detected");
    return true;
  }

  // If there's an accessToken but no expiry info in the session,
  // we assume the token is valid (as the JWT callback should have refreshed it)
  if (session?.accessToken && !session?.idToken) {
    return false;
  }

  // If we have an idToken, check its expiry (this is for backward compatibility)
  if (session?.idToken) {
    try {
      // JWT tokens have 3 parts separated by dots
      const payload = session.idToken.split('.')[1];
      if (!payload) return true;

      // Decode the base64 payload
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());

      // Check expiration (exp is in seconds)
      const expiryTime = decodedPayload.exp * 1000; // Convert to milliseconds

      // If token is expired, but we have an accessToken, the session might still be valid
      // due to token rotation - don't consider it expired in this case
      if (Date.now() >= expiryTime && !session.accessToken) {
        return true;
      }

      return false;
    } catch (error) {
      // If any error in parsing, but we have a valid accessToken, consider the session valid
      console.error('Error checking token expiration:', error);
      return !session.accessToken; // Only consider expired if we don't have an accessToken
    }
  }

  // If we have neither idToken nor accessToken, the session is invalid
  return true;
} 