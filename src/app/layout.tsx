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
  title: "UpSkillWithShree", // Changed title
  description: "Unlock Your Potential: Analyse, Diagnose, and Upskill", // Changed description
  icons: {
    icon: [
      { url: '/graduation-hat.svg' }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/graduation-hat.svg" type="image/svg+xml" />
      </head>
      {/* Remove font variables from className */}
      <body className="antialiased"> 
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
