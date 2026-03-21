"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { generateCustomSheet, saveCustomSheet } from "@/app/custom-sheet-actions";
import { useRouter } from "next/navigation";

interface CreateSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSheetDialog({ open, onOpenChange }: CreateSheetDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [maxQuestions, setMaxQuestions] = useState("15");
  const [sheetName, setSheetName] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topics.trim()) {
      setError("Please enter at least one topic.");
      return;
    }
    setError("");
    setLoading(true);
    setStep(2);

    const res = await generateCustomSheet(topics, experienceLevel, parseInt(maxQuestions) || 15);
    setLoading(false);

    if (res.success && res.questions) {
      setQuestions(res.questions);
      setSheetName(`${experienceLevel} ${topics.split(',')[0].trim()} Sheet`);
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
        setTopics("");
        setQuestions([]);
        setSheetName("");
      }, 500);
      router.push(`/sheet/${res.slug}`);
    } else {
      setError(res.error || "Failed to save sheet.");
    }
  };

  const commonTopics = [
    "Arrays", "Strings", "Linked List", "Trees", 
    "Graphs", "DP", "Greedy", "Recursion", "Binary Search"
  ];

  const handleTopicClick = (topic: string) => {
    const currentTopics = topics.split(",").map(t => t.trim()).filter(t => t !== "");
    if (!currentTopics.includes(topic)) {
      setTopics(topics ? `${topics}, ${topic}` : topic);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#e9efea] dark:bg-neutral-800 border-neutral-200/50 dark:border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-neutral-900 dark:text-white">Create Custom Sheet</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {error && <div className="text-sm font-medium text-red-500 bg-red-100/50 dark:bg-red-900/20 p-3 rounded-xl">{error}</div>}

          {step === 1 && (
            <>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="topics" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Target Topics</Label>
                  <Input
                    id="topics"
                    placeholder="e.g. Arrays, Graphs..."
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    className="bg-white/50 dark:bg-black/20 border-neutral-200 dark:border-white/5 h-12 rounded-xl focus:ring-[#4361EE]"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonTopics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => handleTopicClick(topic)}
                        className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-[#4361EE] hover:text-white dark:hover:bg-[#4361EE] dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="bg-white/50 dark:bg-black/20 border-neutral-200 dark:border-white/5 h-12 rounded-xl">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-neutral-200 dark:border-white/10">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="maxQuestions" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Question Count (5-50)</Label>
                  <Input
                    id="maxQuestions"
                    type="number"
                    min="5"
                    max="50"
                    value={maxQuestions}
                    onChange={(e) => setMaxQuestions(e.target.value)}
                    className="bg-white/50 dark:bg-black/20 border-neutral-200 dark:border-white/5 h-12 rounded-xl"
                  />
                </div>
              </div>
              <Button onClick={handleGenerate} className="w-full bg-[#4361EE] hover:bg-[#324BCC] text-white rounded-2xl h-14 text-lg font-bold shadow-lg shadow-[#4361EE]/20 transition-all hover:translate-y-[-2px] active:translate-y-0">
                Generate with AI
              </Button>
            </>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#4361EE]" />
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 animate-pulse">Curating your custom sheet using Gemini...</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="sheetName">Name your sheet</Label>
                <Input
                  id="sheetName"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  className="bg-neutral-50 dark:bg-[#0b0b0b]"
                />
              </div>

              <div className="space-y-2">
                <Label>Preview ({questions.length} questions)</Label>
                <div className="max-h-[200px] overflow-y-auto border border-neutral-200 dark:border-white/10 rounded-xl p-3 bg-neutral-50 dark:bg-[#0b0b0b] space-y-2">
                  {questions.map((q, i) => (
                    <div key={i} className="text-sm flex items-start gap-2">
                      <span className="text-neutral-400 font-medium min-w-[20px]">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-700 dark:text-neutral-300 truncate">{q.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${
                            q.difficulty === 'Easy' ? 'bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            q.difficulty === 'Medium' ? 'bg-yellow-100/50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setStep(1)} disabled={loading}>
                  Back
                </Button>
                <Button className="flex-1 bg-[#4361EE] hover:bg-[#324BCC] text-white rounded-xl h-11" onClick={handleSave} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Sheet
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
