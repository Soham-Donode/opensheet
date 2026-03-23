import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard - Opensheet",
  description: "Your personalized dashboard for DSA practice.",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const customSheets = await prisma.userSheet.findMany({
    where: { userId },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  // Fetch solved stats
  const solvedProgress = await prisma.userProgress.findMany({
    where: {
      userId,
      isCompleted: true,
    },
    include: {
      question: {
        select: {
          difficulty: true,
          topics: true,
        },
      },
    },
  });

  const stats = {
    total: solvedProgress.length,
    easy: solvedProgress.filter((p) => p.question.difficulty === "Easy").length,
    medium: solvedProgress.filter((p) => p.question.difficulty === "Medium").length,
    hard: solvedProgress.filter((p) => p.question.difficulty === "Hard").length,
  };

  const topicCounts: Record<string, number> = {};
  solvedProgress.forEach((p) => {
    p.question.topics.forEach((t) => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  // Fetch unique topics from the user's questions to suggest them in the 'Add Question' dialog
  const userQuestions = await prisma.question.findMany({
    where: {
      sheetSlug: {
        in: customSheets.map((s) => s.slug),
      },
    },
    select: { topics: true },
  });

  const allTopics = Array.from(
    new Set(userQuestions.flatMap((q) => q.topics)),
  ).sort();

  return (
    <DashboardClient
      customSheets={customSheets}
      allTopics={allTopics}
      stats={stats}
      topTopics={topTopics}
    />
  );
}
