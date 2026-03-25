"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookmarkPlus, Plus, Loader2, X } from "lucide-react";
import {
  getUserSheetsWithPresence,
  toggleQuestionInSheet,
  createEmptySheet,
} from "@/app/custom-sheet-actions";
import { useUser, useClerk } from "@clerk/nextjs";

interface SheetWithPresence {
  id: string;
  name: string;
  slug: string;
  containsQuestion: boolean;
}

interface SaveQuestionDialogProps {
  question: {
    title: string;
    url: string;
    difficulty: string;
    topics: string[];
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SaveQuestionDialog({
  question,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: SaveQuestionDialogProps) {
  const { isSignedIn } = useUser();
  const clerk = useClerk();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [loading, setLoading] = useState(false);
  const [sheets, setSheets] = useState<SheetWithPresence[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newSheetName, setNewSheetName] = useState("");
  const [creating, setCreating] = useState(false);

  const loadSheets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserSheetsWithPresence(question.url);
      setSheets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [question.url]);

  useEffect(() => {
    if (open && isSignedIn) {
      loadSheets();
    }
  }, [open, isSignedIn, loadSheets]);

  const handleToggle = async (sheetSlug: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setSheets(
      sheets.map((s) =>
        s.slug === sheetSlug ? { ...s, containsQuestion: newStatus } : s,
      ),
    );

    try {
      await toggleQuestionInSheet(sheetSlug, question, newStatus);
    } catch {
      // Revert on failure
      setSheets(
        sheets.map((s) =>
          s.slug === sheetSlug ? { ...s, containsQuestion: currentStatus } : s,
        ),
      );
    }
  };

  const handleCreateSheet = async () => {
    if (!newSheetName.trim()) return;
    setCreating(true);
    try {
      const res = await createEmptySheet(newSheetName.trim());
      if (res.success && res.slug) {
        // Automatically add the question to the new sheet!
        await toggleQuestionInSheet(res.slug, question, true);
        setNewSheetName("");
        setShowCreate(false);
        await loadSheets(); // Refresh the list
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      clerk.openSignIn();
    } else {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <button
            onClick={handleTriggerClick}
            className="shrink-0 p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Save to sheet"
          >
            <BookmarkPlus className="w-5 h-5" />
          </button>
        </DialogTrigger>
      )}
      {open && (
        <DialogContent className="sm:max-w-[400px] font-sans bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 rounded-2xl shadow-xl p-0 [&>button]:hidden flex flex-col m-0">
          <div className="w-full relative z-10 flex flex-col max-h-[80vh]">
            <div className="px-6 py-5 flex items-center justify-between border-b border-neutral-200 dark:border-white/10">
              <DialogHeader className="text-left m-0 block">
                <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                  Save question to...
                </DialogTitle>
              </DialogHeader>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 min-h-[150px]">
              {loading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : sheets.length === 0 ? (
                <div className="text-center py-8 px-4 text-neutral-500 text-sm italic">
                  You don&apos;t have any custom sheets yet.
                </div>
              ) : (
                <div className="flex flex-col gap-1 p-2">
                  {sheets.map((sheet) => (
                    <label
                      key={sheet.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      <Checkbox
                        checked={sheet.containsQuestion}
                        onCheckedChange={() =>
                          handleToggle(sheet.slug, sheet.containsQuestion)
                        }
                        className="w-5 h-5 rounded-[4px] border-2 border-neutral-300 dark:border-white/20 data-[state=checked]:border-[#88AB8E] data-[state=checked]:bg-[#88AB8E] dark:data-[state=checked]:bg-[#88AB8E] dark:data-[state=checked]:text-white transition-all shadow-sm"
                      />
                      <span className="font-semibold text-[15px] text-neutral-800 dark:text-neutral-200 truncate flex-1 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {sheet.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/20 rounded-b-2xl">
              {!showCreate ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#88AB8E] hover:text-[#6E8E75] hover:bg-[#88AB8E]/10 font-bold"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create new sheet
                </Button>
              ) : (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input
                    placeholder="Enter sheet name..."
                    value={newSheetName}
                    onChange={(e) => setNewSheetName(e.target.value)}
                    className="border-neutral-300 dark:border-white/20 focus:ring-[#88AB8E]/50 font-medium h-12 rounded-xl"
                    autoFocus
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        newSheetName.trim() &&
                        !creating
                      ) {
                        handleCreateSheet();
                      }
                    }}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreate(false)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#88AB8E] hover:bg-[#6E8E75] text-white rounded-lg shadow-md"
                      disabled={!newSheetName.trim() || creating}
                      onClick={handleCreateSheet}
                    >
                      {creating && (
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      )}
                      Create & Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
