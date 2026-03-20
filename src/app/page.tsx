import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, BrainCog, FolderHeart } from "lucide-react";
import SignInCTA from "@/components/SingInCTA";

export default async function Home() {
  const { userId } = await auth();

  const sheets = [
    {
      title: "Striver A2Z",
      description:
        "Master the most frequently asked problems logically step-by-step.",
      href: "/sheet/striver-a2z",
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "NeetCode 150",
      description:
        "A curated list of leetcode problems to ace your technical interviews.",
      href: "/sheet/neetcode-150",
      icon: <BrainCog className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: "Blind 75",
      description:
        "The classic collection of 75 essential algorithmic problems.",
      href: "/sheet/blind-75",
      icon: <FolderHeart className="w-8 h-8 text-pink-500" />,
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-3">Welcome to OpenSheet</h1>
        <p className="text-gray-600">
          The all-in-one tracker for popular algorithmic problem sheets. Select
          a sheet below to get started. Your progress is automatically saved to
          your account.
        </p>
        {!userId && <SignInCTA />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sheets.map((sheet) => (
          <Link
            key={sheet.href}
            href={sheet.href}
            className="group p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md bg-white transition-all content-start"
          >
            <div className="bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {sheet.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{sheet.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {sheet.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
