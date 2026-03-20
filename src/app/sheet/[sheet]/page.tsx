import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import QuestionCard from "@/components/QuestionCard";
import { notFound } from "next/navigation";

// Define the valid sheets (ideally this comes from DB or config)
const SHEET_NAMES: Record<string, string> = {
  "striver-a2z": "Striver A2Z",
  "neetcode-150": "NeetCode 150",
  "blind-75": "Blind 75",
};

async function fetchQuestionsWithProgress(userId: string | null, sheetSlug: string) {
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

type QuestionWithProgress = Awaited<ReturnType<typeof fetchQuestionsWithProgress>>[number];

export default async function SheetPage({ params }: { params: Promise<{ sheet: string }> }) {
  const { sheet } = await params;
  
  if (!SHEET_NAMES[sheet]) {
    notFound();
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
    (q) => q.progress[0]?.isCompleted === true
  ).length;
  const totalCount = questions.length;

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{SHEET_NAMES[sheet]}</h2>
        {!dbError && totalCount > 0 && (
          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="text-green-600 font-bold">{solvedCount}</span>
            <span className="mx-1">/</span>
            <span>{totalCount}</span>
            <span className="ml-1">solved</span>
          </div>
        )}
      </div>

      {!userId && questions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-6">
          <p className="font-semibold text-sm">You are viewing this sheet in read-only mode.</p>
          <p className="text-xs mt-1">
            To track your progress and save notes, please sign in.
          </p>
        </div>
      )}

      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <p className="font-semibold">Unable to connect to the database.</p>
          <p className="text-sm mt-1">
            Please ensure you have configured your database credentials in <code>.env.local</code> and run:
            <br />
            <code>npx prisma db push</code>
          </p>
        </div>
      )}

      {!dbError && questions.length === 0 && (
        <div className="text-gray-500 italic">
          No questions found for this sheet. Make sure to seed the database for <code>{sheet}</code>.
        </div>
      )}

      {!dbError && questions.length > 0 && (
        <div className="grid gap-4 mt-2">
          {questions.map((q) => {
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
      )}
    </div>
  );
}
