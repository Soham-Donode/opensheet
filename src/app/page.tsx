import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import QuestionCard from "@/components/QuestionCard";

async function fetchQuestionsWithProgress(userId: string) {
  return prisma.question.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      progress: {
        where: { userId },
        take: 1,
      },
    },
  });
}

type QuestionWithProgress = Awaited<ReturnType<typeof fetchQuestionsWithProgress>>[number];

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-2xl font-bold">Welcome to AlgoMerge</h2>
        <p className="text-gray-600">Please sign in to view your problem sheet.</p>
        <div className="bg-black text-white px-4 py-2 rounded-md">
          <SignInButton />
        </div>
      </div>
    );
  }

  let questions: QuestionWithProgress[] = [];
  let dbError = false;

  try {
    questions = await fetchQuestionsWithProgress(userId);
  } catch (error) {
    console.error("Database connection error:", error);
    dbError = true;
  }

  const solvedCount = questions.filter(
    (q) => q.progress[0]?.status === "solved"
  ).length;
  const totalCount = questions.length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Problem Sheet</h2>
        {!dbError && totalCount > 0 && (
          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="text-green-600 font-bold">{solvedCount}</span>
            <span className="mx-1">/</span>
            <span>{totalCount}</span>
            <span className="ml-1">solved</span>
          </div>
        )}
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <p className="font-semibold">Unable to connect to the database.</p>
          <p className="text-sm mt-1">
            Please ensure you have configured your database credentials in <code>.env.local</code> and run:
            <br />
            <code>npx prisma db push</code>
            <br />
            <code>npm run prisma seed</code>
          </p>
        </div>
      )}

      {!dbError && questions.length === 0 && (
        <div className="text-gray-500 italic">
          No questions found. Please run <code>npm run prisma seed</code> after setting up the database.
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
                initialStatus={(progress?.status as "todo" | "in_progress" | "solved" | "skipped") || "todo"}
                initialNotes={progress?.notes || ""}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
