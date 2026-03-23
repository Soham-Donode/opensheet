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

  return <DashboardClient customSheets={customSheets} />;
}
