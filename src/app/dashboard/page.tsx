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

  return <DashboardClient customSheets={customSheets} allTopics={allTopics} />;
}
