'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export interface StreakData {
  currentStreak: number;
  last30Days: boolean[];
}

export async function getUserStreakData(): Promise<StreakData> {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      currentStreak: 0,
      last30Days: Array(30).fill(false)
    };
  }

  // Calculate the date boundary for 30 days ago (UTC to simplify, or local if needed, but UTC is safer for db queries initially)
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // 30 days including today
  thirtyDaysAgo.setHours(0, 0, 0, 0); // Start of 30 days ago
  
  // Fetch completed progress in the last 30 days
  const progress = await prisma.userProgress.findMany({
    where: {
      userId,
      isCompleted: true,
      updatedAt: {
        gte: thirtyDaysAgo,
        lte: today
      }
    },
    select: {
      updatedAt: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  // Create a map to track solved days based on the user's timezone (using UTC representation of the date string to avoid timezone shifts)
  // We'll normalize to YYYY-MM-DD strings to count days
  const solvedDaysMap = new Set<string>();
  
  progress.forEach(p => {
    // Convert to ISO string and take just the date part (YYYY-MM-DD)
    // Note: If you want strictly user-local time, you might need to handle offsets, 
    // but standard UTC dates are often sufficient for general streak tracking
    const dateStr = p.updatedAt.toISOString().split('T')[0]; 
    solvedDaysMap.add(dateStr);
  });

  // Generate the 30-day mapped array and calculate streak
  const last30Days = [];
  let currentStreak = 0;
  let isStreakActive = true; // Flips to false once we hit a day without solving (after accounting for today)

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const wasSolved = solvedDaysMap.has(dateStr);
    last30Days.push(wasSolved);

    // Backward streak calculation looking from today backwards
    // Note: The loop builds array oldest -> newest (left->right visual), 
    // but calculating streak requires going newest -> oldest.
    // We'll calculate streak separately after building the array for clarity.
  }

  // Calculate Streak (Backwards iteration)
  // streak array goes from oldest (index 0) to today (index 29)
  for (let i = 29; i >= 0; i--) {
    const isToday = i === 29;
    const isYesterday = i === 28;
    
    if (last30Days[i]) {
      currentStreak++;
    } else {
      // If it's today, we might just not have solved anything YET. Streak continues if yesterday was solved.
      if (isToday) {
        continue;
      }
      // If any other day is false, the streak is broken
      break;
    }
  }

  return {
    currentStreak,
    last30Days
  };
}
