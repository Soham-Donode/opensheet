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
        <body className="h-screen flex flex-col m-0 p-0 overflow-hidden">
          <ThemeProvider>
            <AppSidebar>
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
