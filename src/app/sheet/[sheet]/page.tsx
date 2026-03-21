import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

// Define the valid sheets (ideally this comes from DB or config)
const SHEET_NAMES: Record<string, string> = {
  "striver-a2z": "Striver A2Z",
  "neetcode-150": "NeetCode 150",
  "blind-75": "Blind 75",
};

async function fetchQuestionsWithProgress(
  userId: string | null,
  sheetSlug: string,
) {
  return prisma.question.findMany({
    where: { sheetSlug },
    orderBy: { createdAt: "asc" },
    include: {
      progress: {
        where: { userId: userId || "" },
        take: 1,
      },
    },
  });
}

type QuestionWithProgress = Awaited<
  ReturnType<typeof fetchQuestionsWithProgress>
>[number];

export default async function SheetPage({
  params,
}: {
  params: Promise<{ sheet: string }>;
}) {
  const { sheet } = await params;

  let sheetName = SHEET_NAMES[sheet];

  if (!sheetName) {
    const customSheet = await prisma.userSheet.findUnique({
      where: { slug: sheet },
      select: { name: true }
    });
    if (customSheet) {
      sheetName = customSheet.name;
    } else {
      notFound();
    }
  }

  const { userId } = await auth();

  let questions: QuestionWithProgress[] = [];
  let dbError = false;

  try {
    questions = await fetchQuestionsWithProgress(userId, sheet);
  } catch (error) {
    console.error("Database connection error in SheetPage:", error);
    dbError = true;
  }

  const solvedCount = questions.filter(
    (q) => q.progress[0]?.isCompleted === true,
  ).length;
  const totalCount = questions.length;
  const progressPercent = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

  // Group questions by primary topic for topic-first display
  const topicGroups = questions.reduce(
    (acc, q) => {
      const topic = q.topics?.[0] || "Uncategorized";
      if (!acc[topic]) {
        acc[topic] = [];
      }
      acc[topic].push(q);
      return acc;
    },
    {} as Record<string, QuestionWithProgress[]>,
  );

  const sortedTopicEntries = Object.entries(topicGroups).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          {sheetName}
        </h1>
        {!dbError && totalCount > 0 && (
          <div className="flex items-center gap-4">
            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800/70 overflow-hidden">
              <div
                className="h-full bg-green-400 dark:bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-sm font-semibold whitespace-nowrap text-gray-700 dark:text-gray-200">
              <span className="text-green-600 dark:text-green-400">
                {solvedCount}
              </span>
              <span className="mx-1">/</span>
              <span>{totalCount}</span>
              <span className="ml-1">solved</span>
            </div>
          </div>
        )}
      </div>

      {!userId && questions.length > 0 && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-sm border border-blue-100 dark:border-blue-800/50 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              You are viewing this sheet in read-only mode.
            </p>
            <p className="text-sm text-blue-800/70 dark:text-blue-200/60 mt-0.5">
              To track your progress and save notes, please sign in.
            </p>
          </div>
          <SignInButton mode="modal">
            <Button
              variant="glass"
              className="rounded-full px-8 py-2.5 h-auto text-sm font-semibold tracking-tight shadow-blue-200/20 dark:shadow-none"
            >
              Sign in to start tracking
            </Button>
          </SignInButton>
        </div>
      )}

      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <p className="font-semibold">Unable to connect to the database.</p>
          <p className="text-sm mt-1">
            Please ensure you have configured your database credentials in{" "}
            <code>.env.local</code> and run:
            <br />
            <code>npx prisma db push</code>
          </p>
        </div>
      )}

      {!dbError && questions.length === 0 && (
        <div className="text-gray-500 italic">
          No questions found for this sheet. Make sure to seed the database for{" "}
          <code>{sheet}</code>.
        </div>
      )}

      {!dbError && questions.length > 0 && (
        <div className="space-y-4 mt-2">
          {sortedTopicEntries.map(([topic, topicQuestions]) => {
            const topicSolved = topicQuestions.filter(
              (q) => q.progress[0]?.isCompleted === true,
            ).length;
            const topicTotal = topicQuestions.length;
            const topicProgress =
              topicTotal > 0 ? (topicSolved / topicTotal) * 100 : 0;

            return (
              <details
                key={topic}
                className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#272627]/50 p-4"
              >
                <summary className="flex items-center justify-between cursor-pointer select-none">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {topic}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {topicSolved} / {topicTotal} solved
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-200">
                    {topicSolved}/{topicTotal}
                  </span>
                </summary>

                <div className="mt-4 space-y-4">
                  {topicQuestions.map((q) => {
                    const progress = q.progress[0];
                    return (
                      <QuestionCard
                        key={q.id}
                        question={{
                          id: q.id,
                          title: q.title,
                          url: q.url,
                          difficulty: q.difficulty,
                          topics: q.topics,
                        }}
                        isCompleted={progress?.isCompleted || false}
                        initialNotes={progress?.notes || ""}
                      />
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
