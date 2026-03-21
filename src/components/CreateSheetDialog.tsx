"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, Plus, Minus, Sparkles, Trash2 } from "lucide-react";
import { generateCustomSheet, saveCustomSheet } from "@/app/custom-sheet-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COMMON_TOPICS = [
  "Arrays", "Strings", "Linked List", "Trees", 
  "Graphs", "DP", "Greedy", "Recursion", "Binary Search", 
  "Two Pointers", "Sliding Window", "Backtracking"
];

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export function CreateSheetDialog({ open, onOpenChange }: CreateSheetDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Refined State
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [maxQuestions, setMaxQuestions] = useState(15);
  
  const [sheetName, setSheetName] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleAddTopic = (topic: string) => {
    const t = topic.trim();
    if (t && !topics.includes(t)) {
      setTopics([...topics, t]);
    }
    setTopicInput("");
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(topics.filter(t => t !== topicToRemove));
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    setQuestions(questions.filter((_, i) => i !== indexToRemove));
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic(topicInput);
    }
  };

  const handleGenerate = async () => {
    if (topics.length === 0) {
      setError("Please select or enter at least one topic.");
      return;
    }
    setError("");
    setLoading(true);
    setStep(2);

    const topicsString = topics.join(", ");
    const res = await generateCustomSheet(topicsString, experienceLevel, maxQuestions);
    setLoading(false);

    if (res.success && res.questions) {
      setQuestions(res.questions);
      setSheetName(`${experienceLevel} ${topics[0]} Sheet`);
      setStep(3);
    } else {
      setError(res.error || "Generation failed.");
      setStep(1);
    }
  };

  const handleSave = async () => {
    if (!sheetName.trim()) {
      setError("Please enter a sheet name.");
      return;
    }
    setError("");
    setLoading(true);

    const res = await saveCustomSheet(sheetName, questions);
    setLoading(false);

    if (res.success && res.slug) {
      onOpenChange(false);
      // Reset state for next time
      setTimeout(() => {
        setStep(1);
        setTopics([]);
        setTopicInput("");
        setQuestions([]);
        setSheetName("");
      }, 500);
      router.push(`/sheet/${res.slug}`);
    } else {
      setError(res.error || "Failed to save sheet.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[550px] max-h-[90vh] font-sans bg-[#e9efea] dark:bg-neutral-900 border-neutral-200/50 dark:border-white/5 rounded-[2rem] shadow-2xl backdrop-blur-3xl overflow-hidden p-0 [&>button]:hidden flex flex-col m-0">
        
        {/* Soft Decorative Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-[#88AB8E]/20 via-transparent to-[#AFC8AD]/10 pointer-events-none z-0" />

        <div className="w-full h-full relative z-10 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Custom Close Button - Absolute for stability */}
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
                <Sparkles className="w-5 h-5 text-[#88AB8E] shrink-0" />
                Sheet Studio
              </DialogTitle>
              <p className="text-[13px] sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Curate your personalized DSA practice sheets.
              </p>
            </DialogHeader>
          </div>

          <div className="flex flex-col gap-6 px-6 sm:px-8 pb-6 sm:pb-8">
          {error && (
            <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 px-4 py-3 rounded-2xl border border-red-200/50 dark:border-red-900/50">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full m-0 p-0">
              {/* Topics Section */}
              <div className="space-y-3 w-full">
                <Label className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-200 uppercase">Target Topics</Label>
                
                {/* Topic Input Box & Selected Tags */}
                <div className="min-h-14 p-2 bg-white/60 dark:bg-black/20 border border-neutral-200 dark:border-white/5 rounded-2xl flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-[#88AB8E]/50 transition-all">
                  {topics.map(topic => (
                    <span key={topic} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#88AB8E] text-white text-xs font-semibold rounded-xl shadow-sm animate-in zoom-in-75 duration-200">
                      {topic}
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveTopic(topic); }} 
                        className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={handleTopicKeyDown}
                    placeholder={topics.length === 0 ? "Type a topic and press Enter..." : "Add another..."}
                    className="flex-1 min-w-[120px] bg-transparent border-none text-sm outline-none px-2 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleAddTopic(topicInput)}
                    className="h-8 rounded-lg text-[#88AB8E] hover:bg-[#88AB8E]/10"
                    disabled={!topicInput.trim()}
                  >
                    Add
                  </Button>
                </div>

                {/* Popular Topics Quick Action */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {COMMON_TOPICS.filter(t => !topics.includes(t)).map(topic => (
                    <button
                      key={topic}
                      onClick={() => handleAddTopic(topic)}
                      className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-[#88AB8E] hover:text-white dark:hover:bg-[#88AB8E] dark:hover:text-white dark:hover:border-[#88AB8E] transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                    >
                      + {topic}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Experience Level */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-200 uppercase">Experience Level</Label>
                <div className="flex gap-2 p-1.5 bg-white/60 dark:bg-black/20 rounded-2xl border border-neutral-200 dark:border-white/5">
                  {EXPERIENCE_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={cn(
                        "flex-1 py-2.5 text-sm font-semibold rounded-[14px] transition-all duration-300",
                        experienceLevel === level 
                          ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]" 
                          : "text-neutral-500 hover:text-[#88AB8E] dark:hover:text-[#88AB8E] hover:bg-white/40 dark:hover:bg-white/5"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Questions Slider/Counter Custom Look */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-200 uppercase">Total Questions</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white/60 dark:bg-black/20 border border-neutral-200 dark:border-white/5 rounded-2xl p-1 shadow-sm">
                    <button 
                      onClick={() => setMaxQuestions(Math.max(5, maxQuestions - 5))}
                      className="p-2.5 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-16 text-center text-lg font-bold text-neutral-800 dark:text-neutral-100">
                      {maxQuestions}
                    </div>
                    <button 
                      onClick={() => setMaxQuestions(Math.min(50, maxQuestions + 5))}
                      className="p-2.5 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {[10, 20, 50].map(preset => (
                      <button
                        key={preset}
                        onClick={() => setMaxQuestions(preset)}
                        className={cn(
                          "px-4 py-2 rounded-2xl text-sm font-bold transition-all border shadow-sm",
                          maxQuestions === preset
                            ? "bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900"
                            : "bg-white/80 border-neutral-200 text-neutral-600 dark:bg-white/5 dark:border-white/10 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/10"
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleGenerate} 
                  className="w-full relative overflow-hidden group bg-[#88AB8E] hover:bg-[#6E8E75] text-white rounded-2xl h-14 text-base font-bold shadow-[0_8px_20px_rgba(136,171,142,0.25)] transition-all hover:translate-y-[-2px] active:translate-y-px"
                >
                  <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="flex items-center justify-center gap-2">
                    Generate Practice Sheet <Sparkles className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in fade-in duration-300 w-full m-0 p-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#88AB8E]/20 rounded-full blur-xl animate-pulse" />
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-full shadow-2xl relative">
                  <Loader2 className="h-8 w-8 animate-spin text-[#88AB8E]" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Curating Your Sheet</h3>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Looking for the best {experienceLevel} problems...</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300 w-full m-0 p-0">
              <div className="space-y-3">
                <Label htmlFor="sheetName" className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-200 uppercase">Name your sheet</Label>
                <Input
                  id="sheetName"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  className="bg-white/80 dark:bg-black/20 border-neutral-200 dark:border-white/10 h-14 rounded-2xl text-lg font-medium focus:ring-[#88AB8E]/50"
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-200 uppercase flex items-center justify-between">
                  <span>Questions Preview</span>
                  <span className="bg-[#88AB8E]/10 text-[#88AB8E] px-2 py-0.5 rounded-lg text-xs font-bold">{questions.length} total</span>
                </Label>
                <div className="max-h-[220px] overflow-y-auto border border-neutral-200 dark:border-white/10 rounded-2xl p-4 bg-white/50 dark:bg-black/20 space-y-3 shadow-inner custom-scrollbar">
                  {questions.length === 0 ? (
                    <div className="text-center py-6 text-neutral-500 text-sm italic">
                      No questions left. Add some topics and generate again.
                    </div>
                  ) : questions.map((q, i) => (
                    <div key={i} className="text-sm flex items-start gap-3 p-3 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-colors group relative pr-10">
                      <span className="text-neutral-400 font-bold min-w-[20px] pt-0.5 text-xs">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-[#88AB8E] transition-colors leading-snug whitespace-normal wrap-break-word">{q.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={cn(
                            "text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md font-bold",
                            q.difficulty === 'Easy' ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            q.difficulty === 'Medium' ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                            'bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          )}>
                            {q.difficulty}
                          </span>
                          {q.topics && q.topics.slice(0, 2).map((t: string) => (
                            <span key={t} className="text-[10px] text-neutral-500 bg-neutral-200/50 dark:bg-white/5 px-1.5 py-0.5 rounded-md truncate max-w-[80px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveQuestion(i)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-500/70 hover:text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Remove question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-2xl h-14 text-base font-bold bg-transparent border-neutral-300 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5" onClick={() => setStep(1)} disabled={loading}>
                  Back Edit
                </Button>
                <Button className="flex-1 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-2xl h-14 text-base font-bold shadow-lg transition-all" onClick={handleSave} disabled={loading || questions.length === 0}>
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Save to Workspace
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
        
        {/* Global Styles for Shimmer & Scrollbar */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
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
