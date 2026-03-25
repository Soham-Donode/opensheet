"use client";

import { updateProgress } from "@/app/actions";
import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, X, MoreVertical, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveQuestionDialog } from "./SaveQuestionDialog";
import { STREAK_UPDATE_EVENT } from "./StreakTracker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    url: string;
    difficulty: string;
    topics: string[];
  };
  isCompleted: boolean;
  initialNotes: string;
  onToggleComplete?: (isCompleted: boolean) => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300",
  medium:
    "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
  hard: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300",
};

const DIFFICULTY_DOT_STYLES: Record<string, string> = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
};

export default function QuestionCard({
  question,
  isCompleted: initialCompleted,
  initialNotes,
  onToggleComplete,
}: QuestionCardProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [notes, setNotes] = useState(initialNotes);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestNotesRef = useRef(notes);

  const { isSignedIn } = useUser();
  const clerk = useClerk();

  // Sync with parent props if they change (e.g. after server revalidation)
  useEffect(() => {
    setIsCompleted(initialCompleted);
  }, [initialCompleted]);

  useEffect(() => {
    latestNotesRef.current = notes;
  }, [notes]);

  const saveProgress = useCallback(
    (completedStatus: boolean, newNotes: string) => {
      startTransition(async () => {
        await updateProgress(question.id, completedStatus, newNotes);
        // Explicitly tell the client-side StreakTracker to refresh
        window.dispatchEvent(new Event(STREAK_UPDATE_EVENT));
      });
    },
    [question.id],
  );

  const handleToggleComplete = (checked: boolean) => {
    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }

    setIsCompleted(checked);
    if (onToggleComplete) {
      onToggleComplete(checked);
    }
    saveProgress(checked, latestNotesRef.current);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveProgress(isCompleted, newNotes);
    }, 800);
  };

  const handleNotesBlur = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    saveProgress(isCompleted, notes);
  };

  const handleNotesClick = () => {
    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }
    setShowNotesModal(true);
  };

  const difficultyStyle =
    DIFFICULTY_STYLES[question.difficulty.toLowerCase()] ||
    "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";

  return (
    <>
      <div
        className={`relative p-4 border rounded-lg bg-[#f4f7f5] dark:bg-[#272627] dark:border-slate-700 transition-all duration-200 flex items-center justify-between gap-4 
        
        `}
      >
        {isPending && (
          <div className="absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500 animate-pulse">
            Saving...
          </div>
        )}

        {/* Checkbox + Title */}
        <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleToggleComplete}
            className="shrink-0 w-5 h-5 rounded border-2 border-gray-300 dark:border-slate-600"
          />
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`relative font-medium transition-colors break-words ${
              isCompleted
                ? "text-[#88AB8E]/60 dark:text-[#AFC8AD]/40"
                : "text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
            }`}
          >
            {question.title}
            {isCompleted && (
              <span className="absolute left-0 top-1/2 w-full h-[2px] bg-[#88AB8E] opacity-60 -translate-y-1/2 rounded-full animate-in slide-in-from-left duration-300" />
            )}
          </a>
        </label>

        {/* Difficulty - Full badge on desktop, dot on mobile */}
        <div className="hidden md:block">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${difficultyStyle}`}
          >
            {question.difficulty}
          </span>
        </div>
        <div className="md:hidden">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              DIFFICULTY_DOT_STYLES[question.difficulty.toLowerCase()] ||
              "bg-gray-500"
            }`}
            title={question.difficulty}
          />
        </div>

        {/* Actions - Separate buttons on desktop, dropdown on mobile */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <SaveQuestionDialog question={question} />
          <button
            onClick={handleNotesClick}
            className="shrink-0 p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Add notes"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  if (!isSignedIn) {
                    clerk.openSignIn();
                    return;
                  }
                  setShowSaveDialog(true);
                }}
              >
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Add to sheet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNotesClick}>
                <FileText className="w-4 h-4 mr-2" />
                Add notes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Save Dialog */}
      <SaveQuestionDialog
        question={question}
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
      />

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 rounded-2xl flex items-center justify-center z-50 p-4">
          <div className="bg-[#e9efea] dark:bg-neutral-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-gray-300 dark:border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {question.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add notes for this problem
                </p>
              </div>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <textarea
                value={notes}
                onChange={handleNotesChange}
                onBlur={handleNotesBlur}
                className="w-full text-sm px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#88AB8E] dark:focus:ring-[#88AB8E]/50 focus:border-transparent"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-white/10 bg-[#e9efea] dark:bg-neutral-900 rounded-b-2xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Auto-saved
              </p>
              <Button
                onClick={() => setShowNotesModal(false)}
                className="bg-[#88AB8E] dark:bg-[#88AB8E] hover:bg-[#6E8E75] dark:hover:bg-[#6E8E75] text-white"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
