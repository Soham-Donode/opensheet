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
  ArrowRight,
  PlusCircle,
} from "lucide-react";
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
  addQuestionToSheet,
} from "@/app/custom-sheet-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function DashboardClient({
  customSheets,
  allTopics = [],
}: {
  customSheets: any[];
  allTopics?: string[];
}) {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Rename Dialog State
  const [renameOpen, setRenameOpen] = useState(false);
  const [sheetToRename, setSheetToRename] = useState<any>(null);
  const [newName, setNewName] = useState("");

  // Add Question Dialog State
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const [sheetForQuestion, setSheetForQuestion] = useState<any>(null);
  const [qTitle, setQTitle] = useState("");
  const [qUrl, setQUrl] = useState("");
  const [qTopic, setQTopic] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [qDifficulty, setQDifficulty] = useState("Medium");
  const [isAddingNewTopic, setIsAddingNewTopic] = useState(false);

  const handleDeleteSheet = (id: string) => {
    startTransition(async () => {
      await deleteUserSheet(id);
    });
  };

  const handleAddQuestion = () => {
    if (!qTitle.trim() || !qUrl.trim() || (!qTopic && !newTopic)) return;

    const topicToUse = isAddingNewTopic ? newTopic.trim() : qTopic;
    if (!topicToUse) return;

    startTransition(async () => {
      const result = await addQuestionToSheet(
        sheetForQuestion.slug,
        qTitle.trim(),
        qUrl.trim(),
        qDifficulty,
        [topicToUse],
      );
      if (result.success) {
        setAddQuestionOpen(false);
        setQTitle("");
        setQUrl("");
        setQTopic("");
        setNewTopic("");
        setIsAddingNewTopic(false);
      }
    });
  };

  return (
    <div className="w-full min-h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-stretch w-full">
        {/* Welcome & Streaks Card */}
        <div className="flex-1 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xs">
          <div className="flex flex-col">
            <h1 className="text-3xl font-sans font-bold text-neutral-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || "Learner"}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Pick up where you left off or start a new challenge.
            </p>
          </div>
          <div className="w-full sm:w-auto shrink-0 flex items-center justify-center bg-neutral-50 dark:bg-black/20 p-4 rounded-3xl border border-neutral-100 dark:border-white/5">
            <StreakTracker expanded={true} />
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="w-full lg:w-80 shrink-0 bg-[#e9efea] dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-center gap-4 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#88AB8E]/20 via-transparent to-[#AFC8AD]/10 pointer-events-none z-0" />
          <h2 className="text-lg font-bold font-sans text-neutral-900 dark:text-white relative z-10">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-3 relative z-10 w-full">
            <Button
              onClick={() => router.push("?create=true")}
              className="w-full bg-[#88AB8E] hover:bg-[#6E8E75] text-white border-none justify-start px-4 h-12 rounded-xl transition-all shadow-[0_4px_12px_rgba(136,171,142,0.2)]"
            >
              <Sparkles className="w-4 h-4 mr-3" /> Sheet Studio
            </Button>
            <Button
              onClick={() => router.push("?merge=true")}
              className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-none justify-start px-4 h-12 rounded-xl transition-all shadow-lg"
            >
              <Merge className="w-4 h-4 mr-3" /> Merge Sheets
            </Button>
          </div>
        </div>
      </div>

      {/* Popular Sheets Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-sans font-bold text-neutral-900 dark:text-white">
            Popular Curated Sheets
          </h2>
          <span className="bg-[#88AB8E]/10 text-[#88AB8E] px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">
            {popularSheets.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSheets.map((sheet) => (
            <Link
              key={sheet.href}
              href={sheet.href}
              className="group p-6 sm:p-8 rounded-[1.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 hover:border-[#88AB8E]/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-none hover:-translate-y-1 block"
            >
              <div className="bg-neutral-50 dark:bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {sheet.icon}
              </div>
              <h3 className="text-xl font-sans font-bold mb-2 text-neutral-900 dark:text-white">
                {sheet.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {sheet.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* User Sheets Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-sans font-bold text-neutral-900 dark:text-white">
              Your Custom Sheets
            </h2>
            <span className="bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              {customSheets.length}
            </span>
          </div>
        </div>

        {customSheets.length === 0 ? (
          <div className="w-full bg-white/50 dark:bg-neutral-900/50 border border-dashed border-neutral-300 dark:border-white/10 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-neutral-100 dark:bg-white/5 p-4 rounded-full mb-4">
              <FileText className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              No custom sheets yet
            </h3>
            <p className="text-neutral-500 max-w-sm mb-6">
              Create a dynamic list of tailored problems or merge existing
              sheets.
            </p>
            <Button
              onClick={() => router.push("?create=true")}
              className="bg-[#88AB8E] hover:bg-[#6E8E75] text-white rounded-xl px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Create First Sheet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {customSheets.map((sheet) => (
              <div
                key={sheet.id}
                className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl p-5 hover:border-[#88AB8E]/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none hover:-translate-y-1"
              >
                <Link
                  href={`/sheet/${sheet.slug}`}
                  className="block h-full cursor-pointer absolute inset-0 z-0"
                />
                <div className="relative z-10 flex items-start justify-between min-h-16">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        sheet.isPinned
                          ? "bg-[#88AB8E]/10 text-[#88AB8E]"
                          : "bg-neutral-100 dark:bg-white/5 text-neutral-500",
                      )}
                    >
                      {sheet.isPinned ? (
                        <Pin className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3
                        className="font-bold text-neutral-900 dark:text-white truncate max-w-30"
                        title={sheet.name}
                      >
                        {sheet.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {sheet.isPinned ? "Pinned List" : "Custom List"}
                      </p>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400"
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
                        <Pin className="w-4 h-4" />{" "}
                        {sheet.isPinned ? "Unpin Sheet" : "Pin Sheet"}
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
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 py-2 px-3 rounded-xl font-medium focus:bg-[#88AB8E]/10 focus:text-[#4A644F] dark:focus:bg-[#88AB8E]/20 dark:focus:text-[#E2EBE4]"
                        onClick={() => {
                          setSheetForQuestion(sheet);
                          setAddQuestionOpen(true);
                        }}
                      >
                        <PlusCircle className="w-4 h-4" /> Add Question
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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

      {/* Add Question Dialog */}
      <Dialog open={addQuestionOpen} onOpenChange={setAddQuestionOpen}>
        <DialogContent className="sm:max-w-112.5 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl p-0 overflow-hidden text-neutral-900 dark:text-white">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold">
              Add Question to {sheetForQuestion?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="qTitle"
                className="text-sm font-semibold text-neutral-500"
              >
                Question Title
              </Label>
              <Input
                id="qTitle"
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
                placeholder="e.g. Two Sum"
                className="h-11 bg-neutral-50 dark:bg-black/20 border-neutral-200 dark:border-white/10 focus:ring-[#88AB8E]/50 focus:border-[#88AB8E] rounded-xl text-[14px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="qUrl"
                className="text-sm font-semibold text-neutral-500"
              >
                Question Link
              </Label>
              <Input
                id="qUrl"
                value={qUrl}
                onChange={(e) => setQUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="h-11 bg-neutral-50 dark:bg-black/20 border-neutral-200 dark:border-white/10 focus:ring-[#88AB8E]/50 focus:border-[#88AB8E] rounded-xl text-[14px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-neutral-500">
                  Difficulty
                </Label>
                <Select value={qDifficulty} onValueChange={setQDifficulty}>
                  <SelectTrigger className="h-11 bg-neutral-50 dark:bg-black/20 border-neutral-200 dark:border-white/10 rounded-xl">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 rounded-xl">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-neutral-500">
                  Topic
                </Label>
                {!isAddingNewTopic ? (
                  <div className="flex gap-2">
                    <Select value={qTopic} onValueChange={setQTopic}>
                      <SelectTrigger className="h-11 flex-1 bg-neutral-50 dark:bg-black/20 border-neutral-200 dark:border-white/10 rounded-xl">
                        <SelectValue placeholder="Topic" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 rounded-xl">
                        {allTopics.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-xl bg-neutral-50 dark:bg-white/5"
                      onClick={() => setIsAddingNewTopic(true)}
                      title="Add new topic"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="New Topic..."
                      className="h-11 flex-1 bg-neutral-50 dark:bg-black/20 border-neutral-200 dark:border-white/10 rounded-xl text-[14px]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-xl bg-neutral-50 dark:bg-white/5"
                      onClick={() => setIsAddingNewTopic(false)}
                      title="Select existing"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 bg-neutral-50 dark:bg-black/20 border-t border-neutral-100 dark:border-white/5 flex gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setAddQuestionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#88AB8E] hover:bg-[#6E8E75] text-white rounded-xl px-6"
              disabled={isPending || !qTitle || !qUrl || (!qTopic && !newTopic)}
              onClick={handleAddQuestion}
            >
              {isPending ? "Adding..." : "Add Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
