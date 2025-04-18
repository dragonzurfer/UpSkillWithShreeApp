import type { Metadata } from "next";
// Remove Geist font imports if not needed
// import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider";

// Remove font constants if imports are removed
// const geistSans = Geist({ ... });
// const geistMono = Geist_Mono({ ... });

// Update or simplify metadata
export const metadata: Metadata = {
  title: "Shree App", // Changed title
  description: "Diagnostic Testing Application", // Changed description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Remove font variables from className */}
      <body className="antialiased"> 
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
