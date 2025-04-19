import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and is an admin
  if (!session) {
    redirect("/api/auth/signin?error=SessionExpired");
  }

  return (
    <div className="admin-layout">
      <div className="admin-header bg-indigo-800 text-white p-4 mb-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      {children}
    </div>
  );
} 