"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  BookOpen,
  BrainCog,
  FolderHeart,
  Sparkles,
  Merge,
  MoreVertical,
  Pin,
  Pencil,
  Trash,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StreakTracker } from "@/components/StreakTracker";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  togglePinUserSheet,
  deleteUserSheet,
  renameUserSheet,
} from "@/app/custom-sheet-actions";
import { useRouter } from "next/navigation";

const popularSheets = [
  {
    title: "Striver A2Z",
    description:
      "Master the most frequently asked problems logically step-by-step.",
    href: "/sheet/striver-a2z",
    icon: <BookOpen className="w-8 h-8 text-[#88AB8E] dark:text-[#88AB8E]" />,
  },
  {
    title: "NeetCode 150",
    description:
      "A curated list of leetcode problems to ace your technical interviews.",
    href: "/sheet/neetcode-150",
    icon: <BrainCog className="w-8 h-8 text-[#88AB8E] dark:text-[#88AB8E]" />,
  },
  {
    title: "Blind 75",
    description: "The classic collection of 75 essential algorithmic problems.",
    href: "/sheet/blind-75",
    icon: (
      <FolderHeart className="w-8 h-8 text-[#88AB8E] dark:text-[#88AB8E]" />
    ),
  },
];

interface CustomSheet {
  id: string;
  name: string;
  slug: string;
  isPinned: boolean;
}

export default function DashboardClient({
  customSheets,
  stats = { total: 0, easy: 0, medium: 0, hard: 0 },
  topTopics = [],
}: {
  customSheets: CustomSheet[];
  stats?: { total: number; easy: number; medium: number; hard: number };
  topTopics?: { name: string; count: number }[];
}) {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Rename Dialog State
  const [renameOpen, setRenameOpen] = useState(false);
  const [sheetToRename, setSheetToRename] = useState<CustomSheet | null>(null);
  const [newName, setNewName] = useState("");

  const handleDeleteSheet = (id: string) => {
    startTransition(async () => {
      await deleteUserSheet(id);
    });
  };

  const pinnedSheets = customSheets.filter((s) => s.isPinned);
  const otherSheets = customSheets.filter((s) => !s.isPinned);

  return (
    <div className="w-full min-h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-stretch w-full">
        {/* Welcome & Streaks Card */}
        <div className="flex-1 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col relative z-10">
            <h1 className="text-3xl font-sans font-bold text-neutral-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || "Learner"}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Pick up where you left off or start a new challenge.
            </p>
          </div>
          <div className="w-full sm:w-auto shrink-0 flex items-center justify-center bg-neutral-50 dark:bg-black/20 p-6 rounded-[2rem] border border-neutral-100 dark:border-white/5 scale-105 sm:scale-110">
            <StreakTracker expanded={true} size="lg" />
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="w-full lg:w-80 shrink-0 bg-[#e9efea] dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#88AB8E]/5 via-transparent to-[#AFC8AD]/5 pointer-events-none z-0" />
          <h2 className="text-lg font-bold font-sans text-neutral-900 dark:text-white relative z-10">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-3 relative z-10 w-full">
            <Button
              onClick={() => router.push("?create=true")}
              variant="outline"
              className="w-full bg-white/50 dark:bg-white/5 border-neutral-200 dark:border-white/10 hover:border-[#88AB8E]/50 hover:bg-[#88AB8E]/5 text-neutral-700 dark:text-neutral-300 justify-start px-4 h-12 rounded-xl transition-all group shadow-xs"
            >
              <Sparkles className="w-4 h-4 mr-3 text-[#88AB8E] group-hover:scale-110 transition-transform" />
              Sheet Studio
            </Button>
            <Button
              onClick={() => router.push("?merge=true")}
              variant="outline"
              className="w-full bg-white/50 dark:bg-white/5 border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 justify-start px-4 h-12 rounded-xl transition-all group shadow-xs"
            >
              <Merge className="w-4 h-4 mr-3 text-neutral-400 group-hover:scale-110 transition-transform" />
              Merge Sheets
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stats */}
        <div className="lg:col-span-4 space-y-8 h-full">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[2rem] p-8 shadow-xs">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-sans font-bold text-neutral-900 dark:text-white">
                Solved Stats
              </h2>
              <div className="bg-[#88AB8E]/10 text-[#88AB8E] px-3 py-1 rounded-full text-sm font-bold">
                {stats.total} Total
              </div>
            </div>

            <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-10 mb-10">
              {/* Circular Progress Ring */}
              <div className="relative w-32 h-32 shrink-0">
                <svg
                  className="w-full h-full -rotate-90 transform"
                  viewBox="0 0 100 100"
                >
                  {/* Background Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-neutral-100 dark:text-white/5"
                  />
                  {/* Easy Segment */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10b981" // Emerald-500
                    strokeWidth="8"
                    strokeDasharray={`${(stats.easy / stats.total) * 251.3} 251.3`}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 251.3 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Medium Segment */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f59e0b" // Amber-500
                    strokeWidth="8"
                    strokeDasharray={`${(stats.medium / stats.total) * 251.3} 251.3`}
                    strokeDashoffset={-(stats.easy / stats.total) * 251.3}
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                  {/* Hard Segment */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f43f5e" // Rose-500
                    strokeWidth="8"
                    strokeDasharray={`${(stats.hard / stats.total) * 251.3} 251.3`}
                    strokeDashoffset={
                      -((stats.easy + stats.medium) / stats.total) * 251.3
                    }
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-neutral-900 dark:text-white leading-none">
                    {stats.total}
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter text-neutral-400 font-bold mt-1">
                    Solved
                  </span>
                </div>
              </div>

              {/* Legend/Details */}
              <div className="w-full space-y-4 px-2">
                {/* Easy Count */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                      Easy
                    </span>
                  </div>
                  <span className="text-base font-bold text-neutral-900 dark:text-white">
                    {stats.easy}
                  </span>
                </div>

                {/* Medium Count */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                      Medium
                    </span>
                  </div>
                  <span className="text-base font-bold text-neutral-900 dark:text-white">
                    {stats.medium}
                  </span>
                </div>

                {/* Hard Count */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                      Hard
                    </span>
                  </div>
                  <span className="text-base font-bold text-neutral-900 dark:text-white">
                    {stats.hard}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                Top Practiced Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {topTopics.length > 0 ? (
                  topTopics.map((topic) => (
                    <div
                      key={topic.name}
                      className="flex items-center gap-2 bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 px-3 py-1.5 rounded-xl hover:border-[#88AB8E]/30 transition-colors"
                    >
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        {topic.name}
                      </span>
                      <span className="text-[10px] bg-neutral-200 dark:bg-white/10 text-neutral-500 dark:text-neutral-400 w-5 h-5 flex items-center justify-center rounded-full leading-none">
                        {topic.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400 italic">
                    Start solving to see your stats
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pinned & Popular Sheets */}
        <div className="lg:col-span-8 space-y-12 h-full">
          {/* Pinned Sheets Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-sans font-bold text-neutral-900 dark:text-white">
                Pinned Sheets
              </h2>
              {pinnedSheets.length > 0 && (
                <span className="bg-[#88AB8E]/10 text-[#88AB8E] px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {pinnedSheets.length}
                </span>
              )}
            </div>

            {pinnedSheets.length === 0 ? (
              <div className="bg-white/50 dark:bg-neutral-900/30 border border-dashed border-neutral-200 dark:border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
                <Pin className="w-8 h-8 text-neutral-300 mb-3" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No pinned sheets yet. Pin your favorites for quick access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pinnedSheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl p-5 hover:border-[#88AB8E]/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none hover:-translate-y-1"
                  >
                    <Link
                      href={`/sheet/${sheet.slug}`}
                      className="absolute inset-0 z-0 pointer-events-none group-hover:pointer-events-auto"
                    />
                    <div className="relative z-10 flex items-start justify-between pointer-events-none">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#88AB8E]/10 text-[#88AB8E]">
                          <Pin className="w-5 h-5 rotate-45" />
                        </div>
                        <div>
                          <h3
                            className="font-bold text-neutral-900 dark:text-white"
                            title={sheet.name}
                          >
                            {sheet.name}
                          </h3>
                        </div>
                      </div>
                      <div className="pointer-events-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 p-1.5 shadow-xl bg-white dark:bg-neutral-900 rounded-[14px] border-neutral-200/50 dark:border-white/10"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 py-2 px-3 rounded-xl font-medium focus:bg-[#88AB8E]/10 focus:text-[#4A644F] dark:focus:bg-[#88AB8E]/20 dark:focus:text-[#E2EBE4]"
                              onClick={() =>
                                startTransition(() =>
                                  togglePinUserSheet(sheet.id, !sheet.isPinned),
                                )
                              }
                            >
                              <Pin className="w-4 h-4" /> Unpin Sheet
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 py-2 px-3 rounded-xl font-medium focus:bg-[#88AB8E]/10 focus:text-[#4A644F] dark:focus:bg-[#88AB8E]/20 dark:focus:text-[#E2EBE4]"
                              onClick={() => {
                                setSheetToRename(sheet);
                                setNewName(sheet.name);
                                setRenameOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 py-2 px-3 rounded-xl font-medium text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 dark:focus:bg-red-950/30"
                              onClick={() => handleDeleteSheet(sheet.id)}
                            >
                              <Trash className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Popular Sheets Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-sans font-bold text-neutral-900 dark:text-white">
                Popular Sheets
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularSheets.map((sheet) => (
                <Link
                  key={sheet.href}
                  href={sheet.href}
                  className="group p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 hover:border-[#88AB8E]/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-none hover:-translate-y-1 block"
                >
                  <div className="bg-neutral-50 dark:bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {sheet.icon}
                  </div>
                  <h3 className="text-lg font-sans font-bold mb-2 text-neutral-900 dark:text-white">
                    {sheet.title}
                  </h3>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed truncate uppercase tracking-widest">
                    {sheet.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Other Custom Sheets Section */}
      {otherSheets.length > 0 && (
        <section className="flex flex-col gap-6 border-t border-neutral-100 dark:border-white/5 pt-12">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-sans font-bold text-neutral-900 dark:text-white">
              Other Custom Sheets
            </h2>
            <span className="bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              {otherSheets.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherSheets.map((sheet) => (
              <div
                key={sheet.id}
                className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl p-5 hover:border-[#88AB8E]/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none hover:-translate-y-1"
              >
                <Link
                  href={`/sheet/${sheet.slug}`}
                  className="absolute inset-0 z-0"
                />
                <div className="relative z-10 flex items-start justify-between min-h-16 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-100 dark:bg-white/5 text-neutral-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className="font-bold text-neutral-900 dark:text-white"
                        title={sheet.name}
                      >
                        {sheet.name}
                      </h3>
                      <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wide">
                        Custom List
                      </p>
                    </div>
                  </div>

                  <div className="pointer-events-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 p-1.5 shadow-xl bg-white dark:bg-neutral-900 rounded-[14px] border-neutral-200/50 dark:border-white/10"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer gap-2 py-2 px-3 rounded-xl font-medium focus:bg-[#88AB8E]/10 focus:text-[#4A644F] dark:focus:bg-[#88AB8E]/20 dark:focus:text-[#E2EBE4]"
                          onClick={() =>
                            startTransition(() =>
                              togglePinUserSheet(sheet.id, !sheet.isPinned),
                            )
                          }
                        >
                          <Pin className="w-4 h-4" /> Pin Sheet
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2 py-2 px-3 rounded-xl font-medium focus:bg-[#88AB8E]/10 focus:text-[#4A644F] dark:focus:bg-[#88AB8E]/20 dark:focus:text-[#E2EBE4]"
                          onClick={() => {
                            setSheetToRename(sheet);
                            setNewName(sheet.name);
                            setRenameOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2 py-2 px-3 rounded-xl font-medium text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 dark:focus:bg-red-950/30"
                          onClick={() => handleDeleteSheet(sheet.id)}
                        >
                          <Trash className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-100 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">
              Rename Sheet
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Sheet name..."
              autoFocus
              className="h-12 bg-neutral-50 dark:bg-black/20 border-neutral-200 dark:border-white/10 focus:ring-[#88AB8E]/50 focus:border-[#88AB8E] rounded-xl text-[15px] font-medium"
            />
          </div>
          <DialogFooter className="px-6 py-4 bg-neutral-50 dark:bg-black/20 border-t border-neutral-100 dark:border-white/5 flex gap-2">
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#88AB8E] hover:bg-[#6E8E75] text-white"
              disabled={isPending}
              onClick={() => {
                if (newName.trim() && sheetToRename) {
                  startTransition(() => {
                    renameUserSheet(sheetToRename.id, newName.trim());
                  });
                }
                setRenameOpen(false);
              }}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
