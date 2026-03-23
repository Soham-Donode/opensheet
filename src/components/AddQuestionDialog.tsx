"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronLeft, PlusCircle, X } from "lucide-react";

interface AddQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  sheetSlug: string;
  existingTopics: string[];
}

function CustomSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = () => setIsOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen]);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex w-full items-center justify-between h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 text-[15px] transition-all hover:bg-neutral-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#88AB8E]/50 ${className}`}
      >
        <span
          className={
            value ? "text-neutral-900 dark:text-white" : "text-neutral-500"
          }
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 shadow-2xl z-60 animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-[240px] overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onValueChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  value === opt
                    ? "bg-[#88AB8E]/10 text-[#88AB8E] font-medium"
                    : "hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddQuestionDialog({
  open,
  onClose,
  sheetSlug,
  existingTopics,
}: AddQuestionDialogProps) {
  const [qTitle, setQTitle] = useState("");
  const [qUrl, setQUrl] = useState("");
  const [qTopic, setQTopic] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [qDifficulty, setQDifficulty] = useState("Medium");
  const [isAddingNewTopic, setIsAddingNewTopic] = useState(false);
  const [isPending, startTransition] = useTransition();

  const topicAvailable = useMemo(
    () => (isAddingNewTopic ? newTopic.trim() : qTopic),
    [isAddingNewTopic, newTopic, qTopic],
  );

  const isValidForm =
    Boolean(qTitle.trim()) && Boolean(qUrl.trim()) && Boolean(topicAvailable);

  useEffect(() => {
    if (!open) {
      setQTitle("");
      setQUrl("");
      setQTopic("");
      setNewTopic("");
      setIsAddingNewTopic(false);
      setQDifficulty("Medium");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleSave = async () => {
    if (!isValidForm) return;

    const topicToUse = isAddingNewTopic ? newTopic.trim() : qTopic;
    if (!topicToUse) return;

    startTransition(async () => {
      const { addQuestionToSheet } = await import("@/app/custom-sheet-actions");
      const result = await addQuestionToSheet(
        sheetSlug,
        qTitle.trim(),
        qUrl.trim(),
        qDifficulty,
        [topicToUse],
      );

      if (result.success) {
        onClose();
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
        aria-modal="true"
        aria-labelledby="add-question-title"
        className="relative w-full max-w-[460px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl text-neutral-900 dark:text-white"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/10 rounded-t-3xl">
          <div>
            <p className="text-sm font-semibold uppercase text-neutral-500 tracking-wider">
              Add Question
            </p>
            <h2
              id="add-question-title"
              className="text-2xl font-bold text-neutral-900 dark:text-white/90 leading-tight"
            >
              Save to this sheet
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-neutral-500">
              Question Title
            </Label>
            <Input
              value={qTitle}
              onChange={(event) => setQTitle(event.target.value)}
              placeholder="e.g. Two Sum"
              className="h-11 text-[15px] rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-[#88AB8E]/50 focus:border-[#88AB8E] transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-neutral-500">
              Question Link
            </Label>
            <Input
              value={qUrl}
              onChange={(event) => setQUrl(event.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="h-11 text-[15px] rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-[#88AB8E]/50 focus:border-[#88AB8E] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-500">
                Difficulty
              </Label>
              <CustomSelect
                value={qDifficulty}
                onValueChange={setQDifficulty}
                options={["Easy", "Medium", "Hard"]}
                placeholder="Select Difficulty"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-500">
                Topic
              </Label>
              {!isAddingNewTopic ? (
                <div className="flex items-center gap-2">
                  <CustomSelect
                    value={qTopic}
                    onValueChange={setQTopic}
                    options={existingTopics}
                    placeholder="Select Topic"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-xl border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10 shadow-sm transition-all"
                    onClick={() => setIsAddingNewTopic(true)}
                    aria-label="Add new topic"
                  >
                    <PlusCircle className="w-4 h-4 text-[#88AB8E]" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    value={newTopic}
                    onChange={(event) => setNewTopic(event.target.value)}
                    placeholder="New topic"
                    className="flex-1 h-11 text-[15px] rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-[#88AB8E]/50 focus:border-[#88AB8E] transition-all"
                    autoFocus
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-xl border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10 shadow-sm transition-all"
                    onClick={() => setIsAddingNewTopic(false)}
                    aria-label="Use existing topic"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#88AB8E]" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-neutral-100 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 flex gap-3 rounded-b-3xl">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl h-12 border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 font-semibold hover:bg-neutral-100 dark:hover:bg-white/5"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-2xl h-12 bg-[#88AB8E] hover:bg-[#6E8E75] text-white font-bold shadow-lg shadow-[#88AB8E]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            onClick={handleSave}
            disabled={!isValidForm || isPending}
          >
            {isPending ? "Adding..." : "Save to Workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
}
