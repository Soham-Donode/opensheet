import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import SheetFilterAndList from "@/components/SheetFilterAndList";
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
      select: { name: true },
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
  const globalSolvedUrls = new Set<string>();

  try {
    questions = await fetchQuestionsWithProgress(userId, sheet);

    if (userId) {
      const globalSolvedProgress = await prisma.userProgress.findMany({
        where: { userId, isCompleted: true },
        select: { question: { select: { url: true } } },
      });
      globalSolvedProgress.forEach((p) => {
        if (p.question) globalSolvedUrls.add(p.question.url);
      });
    }
  } catch (error) {
    console.error("Database connection error in SheetPage:", error);
    dbError = true;
  }

  const enhancedQuestions = questions.map((q) => ({
    ...q,
    isSolvedGlobally: globalSolvedUrls.has(q.url),
    isCompletedLocally: q.progress[0]?.isCompleted === true,
  }));




  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      {!userId && enhancedQuestions.length > 0 && (
        <div className="bg-[#88AB8E]/5 dark:bg-[#88AB8E]/10 backdrop-blur-sm border border-[#88AB8E]/20 dark:border-[#88AB8E]/30 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#4A644F] dark:text-[#E2EBE4]">
              You are viewing this sheet in read-only mode.
            </p>
            <p className="text-sm text-[#6E8E75]/80 dark:text-[#AFC8AD]/80 mt-0.5">
              To track your progress and save notes, please sign in.
            </p>
          </div>
          <SignInButton mode="modal"><Button
              variant="glass"
              className="rounded-full px-8 py-2.5 h-auto text-sm font-semibold tracking-tight shadow-[#88AB8E]/20 dark:shadow-none"
            >
              Sign in to start tracking
            </Button></SignInButton>
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

      {!dbError && enhancedQuestions.length === 0 && (
        <div className="flex flex-col gap-6">
          <div className="text-gray-500 italic">
            No questions found for this sheet. Add your first question to get
            started.
          </div>
          <SheetFilterAndList
            questions={[]}
            userId={userId}
            sheetName={sheetName}
            sheetSlug={sheet}
            isStandard={Boolean(SHEET_NAMES[sheet])}
          />
        </div>
      )}

      {!dbError && enhancedQuestions.length > 0 && (
        <SheetFilterAndList
          questions={enhancedQuestions}
          userId={userId}
          sheetName={sheetName}
          sheetSlug={sheet}
          allTopics={enhancedQuestions.flatMap((q) => q.topics)}
          isStandard={Boolean(SHEET_NAMES[sheet])}
        />
      )}
    </div>
  );
}
