"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Copy } from "lucide-react";
import { cloneSheet } from "@/app/custom-sheet-actions";

interface CloneSheetDialogProps {
  open: boolean;
  onClose: () => void;
  sourceSheetSlug: string;
  sourceSheetName: string;
}

export default function CloneSheetDialog({
  open,
  onClose,
  sourceSheetSlug,
  sourceSheetName,
}: CloneSheetDialogProps) {
  const [newName, setNewName] = useState(`${sourceSheetName} (Clone)`);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClone = async () => {
    if (!newName.trim()) return;

    startTransition(async () => {
      const result = await cloneSheet(newName.trim(), sourceSheetSlug);
      if (result.success) {
        onClose();
        router.push(`/sheet/${result.slug}`);
      } else {
        alert(result.error || "Failed to clone sheet");
      }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        className="relative w-full max-w-[440px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl text-neutral-900 dark:text-white overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#88AB8E]/10 flex items-center justify-center">
              <Copy className="w-5 h-5 text-[#88AB8E]" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-neutral-500 tracking-wider">
                Clone Sheet
              </p>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white/90">
                Create your copy
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            This will create a new custom sheet with all the questions from{" "}
            <span className="font-semibold text-neutral-700 dark:text-neutral-200">
              {sourceSheetName}
            </span>{" "}
            so you can add your own problems and track progress privately.
          </p>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-neutral-500">
              Sheet Name
            </Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="My copy of the sheet"
              className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-[#88AB8E]/50 focus:border-[#88AB8E]"
              autoFocus
            />
          </div>
        </div>

        <div className="px-6 py-5 border-t border-neutral-100 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl h-12"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-2xl h-12 bg-[#88AB8E] hover:bg-[#6E8E75] text-white font-bold"
            onClick={handleClone}
            disabled={isPending || !newName.trim()}
          >
            {isPending ? "Cloning..." : "Clone Sheet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
