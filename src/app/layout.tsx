import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoMerge – DSA Practice Tracker",
  description:
    "One beautiful place to track all your DSA practice across multiple popular problem sheets.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="h-screen flex flex-col m-0 p-0 overflow-hidden">
          <AppSidebar>
            <header className="flex justify-end items-center px-8 py-4  w-full sticky top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg z-30 transition-all duration-300">
              {/* Profile moved to sidebar bottom */}
            </header>
            <main className="flex-1 overflow-y-auto bg-dot-matrix">
              {children}
            </main>
          </AppSidebar>
        </body>
      </html>
    </ClerkProvider>
  );
}
