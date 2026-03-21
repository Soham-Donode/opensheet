import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  title: "Opensheet – DSA Practice Tracker",
  description:
    "One beautiful place to track all your DSA practice across multiple popular problem sheets.",
};

import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  
  let customSheets: any[] = [];
  if (userId) {
    try {
      customSheets = await prisma.userSheet.findMany({
        where: { userId },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      });
    } catch (e) {
      console.error("Failed to fetch custom sheets:", e);
    }
  }

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = theme === 'dark' || (!theme && prefersDark);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className="h-full md:h-screen flex flex-col m-0 p-0 overflow-x-hidden md:overflow-hidden">
          <ThemeProvider>
            <AppSidebar customSheets={customSheets}>
              <main className="flex-1 overflow-y-auto bg-dot-matrix">
                {children}
              </main>
            </AppSidebar>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
