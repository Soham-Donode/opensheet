import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { AppSidebar } from "@/components/AppSidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoMerge – DSA Practice Tracker",
  description: "One beautiful place to track all your DSA practice across multiple popular problem sheets.",
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
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="h-screen flex flex-col m-0 p-0 overflow-hidden">
          <AppSidebar>
            <header className="flex justify-end items-center p-4 border-b border-neutral-200 dark:border-neutral-700 w-full sticky top-0 bg-white dark:bg-neutral-900 z-10">
              <div>
                {!userId ? (
                  <SignInButton />
                ) : (
                  <UserButton />
                )}
              </div>
            </header>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </AppSidebar>
        </body>
      </html>
    </ClerkProvider>
  );
}
