"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserStreakData, StreakData } from "@/app/streak-actions";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

// Event name for cross-component communication
export const STREAK_UPDATE_EVENT = "opensheet:streak-update";

interface StreakTrackerProps {
  expanded: boolean;
  size?: "sm" | "lg";
}

export function StreakTracker({ expanded, size = "sm" }: StreakTrackerProps) {
  const { isSignedIn } = useUser();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    last30Days: Array(30).fill(false),
  });
  const [loading, setLoading] = useState(true);

  const fetchStreak = useCallback(() => {
    if (isSignedIn) {
      getUserStreakData()
        .then((data) => {
          setStreakData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load streak data", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setStreakData({
        currentStreak: 0,
        last30Days: Array(30).fill(false),
      });
    }
  }, [isSignedIn]);

  useEffect(() => {
    setTimeout(() => fetchStreak(), 0);
  }, [fetchStreak]);

  // Listen for custom events to refresh streak data
  useEffect(() => {
    const handleUpdate = () => {
      fetchStreak();
    };

    window.addEventListener(STREAK_UPDATE_EVENT, handleUpdate);
    // Also refresh on window focus just in case
    window.addEventListener("focus", handleUpdate);

    return () => {
      window.removeEventListener(STREAK_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [fetchStreak]);

  // If loading or completely unavailable, maybe we show an empty skeleton
  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 transition-all p-2.5 rounded-2xl bg-neutral-100/50 dark:bg-white/5",
          !expanded && "justify-center w-11 h-11 p-0"
        )}
      >
        <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-white/10 animate-pulse shrink-0" />
        {expanded && (
          <div className="flex-1 flex flex-col gap-1.5 opacity-50">
            <div className="h-3 w-16 bg-neutral-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="grid grid-cols-10 gap-[2px]">
              {Array(30).fill(0).map((_, i) => (
                <div key={i} className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px] bg-neutral-200 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center transition-all bg-[#e9efea] dark:bg-[#272627]/50 border border-neutral-200 dark:border-white/10 rounded-2xl group",
        expanded ? "p-3 gap-3" : "w-11 h-11 p-0 justify-center gap-0"
      )}
      title={`${streakData.currentStreak} Day Streak`}
    >
      {/* Fire Icon Container */}
      <div 
        className={cn(
          "relative flex items-center justify-center shrink-0 transition-transform",
          streakData.currentStreak > 0 && "group-hover:scale-110",
          !expanded && "w-full h-full"
        )}
      >
        <Flame 
          className={cn(
            "w-5 h-5 z-10",
            streakData.currentStreak > 0 
              ? "text-orange-500 dark:text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" 
              : "text-neutral-400 dark:text-neutral-500"
          )} 
          strokeWidth={streakData.currentStreak > 0 ? 2.5 : 2}
        />
        {/* Number Badge (Only show when collapsed or if we want it floating, but here we just place it below if collapsed) */}
        {!expanded && (
            <span className={cn(
               "absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full z-20 shadow-sm border border-white dark:border-neutral-900",
               streakData.currentStreak > 0 
                 ? "bg-orange-500 text-white" 
                 : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
            )}>
              {streakData.currentStreak}
            </span>
        )}
      </div>

      {/* Heatmap Section (Only when expanded) */}
      {expanded && (
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {streakData.currentStreak} Day Streak
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">Last 30 days</span>
          </div>
          
          <div className="grid grid-cols-10 gap-x-[3px] gap-y-[3px]">
            {streakData.last30Days.map((isSolved, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[2px] transition-colors",
                  size === "lg" ? "w-3 h-3 sm:w-4 sm:h-4" : "w-full pt-[100%]",
                  isSolved 
                    ? "bg-[#88AB8E] dark:bg-[#88AB8E] shadow-[0_0_4px_rgba(136,171,142,0.4)]" 
                    : "bg-neutral-200/60 dark:bg-white/5"
                )}
                title={isSolved ? "Completed" : "No activity"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
