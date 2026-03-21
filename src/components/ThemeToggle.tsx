"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle({ expanded = true }: { expanded?: boolean }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dark mode is already enabled
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;

    const html = document.documentElement;
    const newIsDark = !isDark;

    if (newIsDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(newIsDark);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-between transition-all duration-200 rounded-lg ${
        expanded
          ? "w-full px-3 py-2.5 hover:bg-neutral-100/70 dark:hover:bg-white/5"
          : "w-11 h-11 justify-center hover:bg-neutral-100/70 dark:hover:bg-white/5"
      }`}
      aria-label="Toggle dark mode"
    >
      {expanded ? (
        <>
          <div className="flex items-center gap-3 min-w-0">
            {isDark ? (
              <Moon className="h-4 w-4 text-neutral-400 shrink-0" />
            ) : (
              <Sun className="h-4 w-4 text-neutral-600 shrink-0" />
            )}
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate">
              {isDark ? "Dark" : "Light"}
            </span>
          </div>

          {/* Slider toggle - only shown when expanded */}
          <div className="relative inline-flex items-center shrink-0">
            <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 rounded-full border border-neutral-400/30 dark:border-white/10 transition-colors">
              <motion.div
                className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm dark:shadow-none"
                animate={{ x: isDark ? 16 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </div>
        </>
      ) : (
        /* Show just icon when collapsed */
        <>
          {isDark ? (
            <Moon className="h-5 w-5 text-neutral-400" />
          ) : (
            <Sun className="h-5 w-5 text-neutral-600" />
          )}
        </>
      )}
    </button>
  );
}
