"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, Merge, CheckCircle2, Circle } from "lucide-react";
import { mergeSheets } from "@/app/custom-sheet-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CustomSheet {
  name: string;
  slug: string;
  id?: string;
  isPinned?: boolean;
}

interface PopularSheet {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface MergeSheetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customSheets: CustomSheet[];
  popularSheets: PopularSheet[];
}

export function MergeSheetsDialog({ open, onOpenChange, customSheets, popularSheets }: MergeSheetsDialogProps) {
  const router = useRouter();
  const [sheetName, setSheetName] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Dashboard is in popularSheets but we shouldn't merge it
  const validPopularSheets = popularSheets.filter(s => s.href.startsWith("/sheet/")).map(s => ({
    name: s.label,
    slug: s.href.replace("/sheet/", ""),
    isBuiltIn: true
  }));

  const validCustomSheets = customSheets.map(s => ({
    name: s.name,
    slug: s.slug,
    isBuiltIn: false
  }));

  const allAvailableSheets = [...validPopularSheets, ...validCustomSheets];

  const toggleSelection = (slug: string) => {
    setSelectedSlugs(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleMerge = () => {
    if (!sheetName.trim()) {
      setError("Please enter a name for the new sheet.");
      return;
    }
    if (selectedSlugs.length < 2) {
      setError("Please select at least two sheets to merge.");
      return;
    }

    setError("");
    
    startTransition(async () => {
      const res = await mergeSheets(sheetName, selectedSlugs);
      if (res.success && res.slug) {
        onOpenChange(false);
        // Reset state
        setTimeout(() => {
          setSheetName("");
          setSelectedSlugs([]);
        }, 500);
        router.push(`/sheet/${res.slug}`);
      } else {
        setError(res.error || "Failed to merge sheets.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[550px] max-h-[90vh] font-sans bg-[#e9efea] dark:bg-neutral-900 border-neutral-200/50 dark:border-white/5 rounded-[2rem] shadow-2xl backdrop-blur-3xl overflow-hidden p-0 [&>button]:hidden flex flex-col m-0">
        
        {/* Soft Decorative Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-[#88AB8E]/20 via-transparent to-[#AFC8AD]/10 pointer-events-none z-0" />

        <div className="w-full h-full relative z-10 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Custom Close Button */}
          <button 
            onClick={() => onOpenChange(false)} 
            className="absolute right-6 top-6 shrink-0 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-neutral-500 hover:text-neutral-900 dark:hover:text-white z-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-6 sm:px-8 py-8 pb-4">
            <DialogHeader className="text-left space-y-0.5 m-0 block w-full pr-10">
              <DialogTitle className="flex items-center gap-2 text-[22px] sm:text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
                <Merge className="w-5 h-5 text-[#88AB8E] shrink-0" />
                Merge Sheets
              </DialogTitle>
              <p className="text-[13px] sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Combine questions from multiple sheets into a new custom sheet.
              </p>
            </DialogHeader>
          </div>

          <div className="flex flex-col gap-6 px-6 sm:px-8 pb-6 sm:pb-8">
            {error && (
              <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 px-4 py-3 rounded-2xl border border-red-200/50 dark:border-red-900/50">
                {error}
              </div>
            )}

            <div className="space-y-6 sm:space-y-8 w-full m-0 p-0">
              <div className="space-y-3">
                <Label htmlFor="mergeSheetName" className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-200 uppercase">New Sheet Title</Label>
                <Input
                  id="mergeSheetName"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="e.g. Master DSA List"
                  className="bg-white/80 dark:bg-black/20 border-neutral-200 dark:border-white/10 h-14 rounded-2xl text-lg font-medium focus:ring-[#88AB8E]/50"
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-200 uppercase flex items-center justify-between">
                  <span>Select Sheets to Merge</span>
                  <span className="bg-[#88AB8E]/10 text-[#88AB8E] px-2 py-0.5 rounded-lg text-xs font-bold">{selectedSlugs.length} selected</span>
                </Label>
                
                <div className="max-h-[260px] overflow-y-auto border border-neutral-200 dark:border-white/10 rounded-2xl p-2 bg-white/50 dark:bg-black/20 space-y-1 shadow-inner custom-scrollbar relative">
                  {allAvailableSheets.length === 0 ? (
                    <div className="text-center py-6 text-neutral-500 text-sm italic">
                      No sheets available to merge.
                    </div>
                  ) : (
                    allAvailableSheets.map((sheet) => {
                      const isSelected = selectedSlugs.includes(sheet.slug);
                      return (
                        <button
                          key={sheet.slug}
                          onClick={() => toggleSelection(sheet.slug)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border",
                            isSelected 
                              ? "bg-white dark:bg-neutral-800 border-[#88AB8E]/50 shadow-[0_2px_10px_rgba(0,0,0,0.04)]" 
                              : "bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-white/5"
                          )}
                        >
                          <div className="flex flex-col items-start gap-1">
                            <span className={cn(
                              "text-[15px] font-semibold transition-colors",
                              isSelected ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"
                            )}>
                              {sheet.name}
                            </span>
                            {sheet.isBuiltIn && (
                              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-200/50 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                                Popular built-in
                              </span>
                            )}
                          </div>
                          
                          <div className={cn(
                            "shrink-0 transition-colors",
                            isSelected ? "text-[#88AB8E]" : "text-neutral-300 dark:text-neutral-600"
                          )}>
                            {isSelected ? (
                              <CheckCircle2 className="w-5 h-5 fill-[#88AB8E]/10" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleMerge} 
                  disabled={isPending || selectedSlugs.length < 2 || !sheetName.trim()}
                  className="w-full relative overflow-hidden group bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-2xl h-14 text-base font-bold shadow-lg transition-all active:translate-y-px"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Merge className="w-4 h-4" /> Merge Selected Sheets
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrollbar styles matching CreateSheetDialog */}
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.3);
            border-radius: 10px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `}} />
      </DialogContent>
    </Dialog>
  );
}
