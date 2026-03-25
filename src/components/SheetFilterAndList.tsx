"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Search,
  Shuffle,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import QuestionCard from "@/components/QuestionCard";
import AddQuestionDialog from "@/components/AddQuestionDialog";
import CloneSheetDialog from "@/components/CloneSheetDialog";

interface Progress {
  isCompleted: boolean;
  notes: string | null;
}

interface Question {
  id: string;
  title: string;
  url: string;
  difficulty: string;
  topics: string[];
  progress: Progress[];
  isSolvedGlobally: boolean;
  isCompletedLocally: boolean;
}

interface SheetFilterAndListProps {
  questions: Question[];
  userId: string | null;
  sheetName: string;
  sheetSlug: string; // Add sheetSlug to props
  allTopics?: string[]; // Add allTopics for suggestions
  isStandard?: boolean;
}

export default function SheetFilterAndList({
  questions,
  sheetName,
  sheetSlug,
  isStandard = false,
}: SheetFilterAndListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "solved", "unsolved", "solved_other"
  const [difficultyFilter, setDifficultyFilter] = useState("all"); // "all", "easy", "medium", "hard"
  const [forceExpandedTopics, setForceExpandedTopics] = useState<Set<string>>(
    new Set(),
  );
  const [showGlobalSolved, setShowGlobalSolved] = useState(true);

  // Dialog States
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const [cloneSheetOpen, setCloneSheetOpen] = useState(false);

  const totalSolved = useMemo(() => {
    return questions.filter(
      (q) => q.isCompletedLocally || (showGlobalSolved && q.isSolvedGlobally),
    ).length;
  }, [questions, showGlobalSolved]);

  const progressPercent =
    questions.length > 0 ? (totalSolved / questions.length) * 100 : 0;

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. Search Query
      if (
        searchQuery &&
        !q.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 2. Difficulty Filter
      if (
        difficultyFilter !== "all" &&
        q.difficulty.toLowerCase() !== difficultyFilter
      ) {
        return false;
      }

      // 3. Status Filter
      const isSolved =
        q.isCompletedLocally || (showGlobalSolved && q.isSolvedGlobally);
      if (statusFilter === "solved") {
        if (!isSolved) return false;
      } else if (statusFilter === "unsolved") {
        if (isSolved) return false;
      } else if (statusFilter === "solved_other") {
        if (!q.isSolvedGlobally) return false;
      }

      return true;
    });
  }, [
    questions,
    searchQuery,
    statusFilter,
    difficultyFilter,
    showGlobalSolved,
  ]);

  const topicGroups = useMemo(() => {
    return filteredQuestions.reduce(
      (acc, q) => {
        const topic = q.topics?.[0] || "Uncategorized";
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(q);
        return acc;
      },
      {} as Record<string, Question[]>,
    );
  }, [filteredQuestions]);

  const existingTopics = useMemo(() => {
    return Array.from(new Set(questions.flatMap((q) => q.topics))).sort();
  }, [questions]);

  const sortedTopicEntries = Object.entries(topicGroups).sort(([a], [b]) =>
    a.localeCompare(b),
  );





  const handleToggleGlobal = () => {
    setShowGlobalSolved(!showGlobalSolved);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-6 px-1">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-900 dark:text-white">
          {sheetName}
        </h1>
        {questions.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#88AB8E] dark:bg-[#88AB8E] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-sm font-semibold whitespace-nowrap text-neutral-500 dark:text-neutral-400 mt-1 sm:mt-0 flex items-center justify-end sm:w-auto w-full">
              <span className="text-[#88AB8E] text-base md:text-lg">
                {totalSolved}
              </span>
              <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">
                /
              </span>
              <span className="text-neutral-600 dark:text-neutral-300">
                {questions.length}
              </span>
              <span className="ml-1.5 font-normal text-xs md:text-sm">
                solved
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-3 bg-white dark:bg-[#272627]/50 border border-neutral-200 dark:border-white/10 p-2 lg:p-2 rounded-2xl shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1 lg:flex-initial lg:w-60 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#88AB8E] transition-colors" />
            <Input
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 h-9 bg-transparent border-0 focus-visible:ring-0 shadow-none text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
          </div>
          <div className="hidden lg:block w-px h-5 bg-neutral-200 dark:bg-white/10 shrink-0"></div>
          <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-2 lg:gap-3">
            {/* Status Dropdown */}
            <CustomSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { label: "All Status", value: "all" },
                { label: "Solved", value: "solved" },
                { label: "Unsolved", value: "unsolved" },
                { label: "In Other Lists", value: "solved_other" },
              ]}
              size="sm"
              className="lg:w-40 bg-transparent border-0 dark:bg-transparent"
              dropdownClassName="lg:w-48"
            />

            <div className="hidden lg:block w-px h-5 bg-neutral-200 dark:bg-white/10 shrink-0"></div>

            {/* Difficulty Dropdown */}
            <CustomSelect
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
              options={[
                { label: "Any Difficulty", value: "all" },
                { label: "Easy", value: "easy" },
                { label: "Medium", value: "medium" },
                { label: "Hard", value: "hard" },
              ]}
              size="sm"
              className="lg:w-40 bg-transparent border-0 dark:bg-transparent"
              dropdownClassName="lg:w-48"
            />
          </div>
          <div className="hidden lg:block flex-1"></div>{" "}
          {/* Spacer to push buttons right */}
          {/* Global Solved Toggle & Action Button */}
          <div className="grid grid-cols-2 lg:flex items-center gap-2 lg:gap-3 lg:pr-1">
            <Button
              variant="outline"
              onClick={handleToggleGlobal}
              className={`rounded-xl px-4 transition-all text-[10px] sm:text-xs font-bold h-9 flex-1 lg:flex-initial border-[#88AB8E]/30 ${showGlobalSolved ? "bg-[#88AB8E]/10 text-[#88AB8E] border-[#88AB8E]/50" : "text-neutral-500 border-neutral-200 dark:border-white/10"}`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 mr-2 ${showGlobalSolved ? "text-[#88AB8E]" : "text-neutral-400"}`}
              />
              {showGlobalSolved ? "Sync: ON" : "Sync: OFF"}
            </Button>

            {!isStandard ? (
              <Button
                variant="outline"
                onClick={() => setAddQuestionOpen(true)}
                className="rounded-xl px-4 h-9 border-[#88AB8E]/30 hover:bg-[#88AB8E]/10 hover:text-[#88AB8E] dark:hover:text-[#AFC8AD] text-neutral-600 dark:text-neutral-300 text-[10px] sm:text-xs font-bold transition-all flex-1 lg:flex-initial"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-2" />
                Add Question
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setCloneSheetOpen(true)}
                className="rounded-xl px-4 h-9 border-[#88AB8E]/30 hover:bg-[#88AB8E]/10 hover:text-[#88AB8E] dark:hover:text-[#AFC8AD] text-neutral-600 dark:text-neutral-300 text-[10px] sm:text-xs font-bold transition-all flex-1 lg:flex-initial"
              >
                <Shuffle className="w-3.5 h-3.5 mr-2" />
                Clone Sheet
              </Button>
            )}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {sortedTopicEntries.length === 0 ? (
            <div className="text-center py-12 bg-white/50 dark:bg-neutral-800/20 rounded-2xl border border-neutral-200 dark:border-white/5 border-dashed">
              <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                No problems match your filters.
              </p>
            </div>
          ) : (
            sortedTopicEntries.map(([topic, topicQuestions]) => {
              const topicSolved = topicQuestions.filter(
                (q) =>
                  q.isCompletedLocally ||
                  (showGlobalSolved && q.isSolvedGlobally),
              ).length;
              const topicTotal = topicQuestions.length;
              const topicProgress =
                topicTotal > 0 ? (topicSolved / topicTotal) * 100 : 0;
              const isSelfExpanded =
                searchQuery.length > 0 || forceExpandedTopics.has(topic);

              return (
                <details
                  key={topic}
                  className="group/details rounded-2xl border border-neutral-200 dark:border-white/10 bg-[#e9efea] dark:bg-[#272627]/50 p-4 transition-all"
                  open={isSelfExpanded}
                  onToggle={(e) => {
                    const target = e.currentTarget as HTMLDetailsElement;
                    if (target.open) {
                      setForceExpandedTopics((prev) =>
                        new Set(prev).add(topic),
                      );
                    } else {
                      setForceExpandedTopics((prev) => {
                        const next = new Set(prev);
                        next.delete(topic);
                        return next;
                      });
                    }
                  }}
                >
                  <summary className="flex items-center justify-between cursor-pointer select-none outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-[#88AB8E]">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 group-details-open:text-[#88AB8E] transition-colors">
                        {topic}
                      </h2>
                      <div className="text-sm text-neutral-500 flex items-center gap-2 font-medium">
                        <div className="w-24 h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-[#88AB8E] rounded-full transition-all duration-300"
                            style={{ width: `${topicProgress}%` }}
                          />
                        </div>
                        <span>
                          {topicSolved}/{topicTotal} solved
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center transform transition-transform duration-200 group-open/details:rotate-180">
                      <svg
                        className="w-4 h-4 text-neutral-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </summary>

                  <div className="mt-4 flex flex-col gap-3">
                    {isSelfExpanded &&
                      topicQuestions.map((question) => {
                        const isSolved =
                          question.isCompletedLocally ||
                          (showGlobalSolved && question.isSolvedGlobally);
                        return (
                          <div id={`question-${question.id}`} key={question.id}>
                            <QuestionCard
                              question={question}
                              isCompleted={isSolved}
                              initialNotes={question.progress[0]?.notes || ""}
                            />
                          </div>
                        );
                      })}
                  </div>
                </details>
              );
            })
          )}
        </div>
      </div>

      {/* Add Question Dialog */}
      <AddQuestionDialog
        open={addQuestionOpen}
        onClose={() => setAddQuestionOpen(false)}
        sheetSlug={sheetSlug}
        existingTopics={existingTopics}
      />

      <CloneSheetDialog
        open={cloneSheetOpen}
        onClose={() => setCloneSheetOpen(false)}
        sourceSheetSlug={sheetSlug}
        sourceSheetName={sheetName}
      />
    </div>
  );
}
