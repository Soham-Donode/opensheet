"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onValueChange: (val: string) => void;
  options: string[] | { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  size?: "sm" | "md";
}

export function CustomSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className = "",
  dropdownClassName = "",
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) =>
    typeof opt === "string" ? opt === value : opt.value === value,
  );

  const displayValue = selectedOption
    ? typeof selectedOption === "string"
      ? selectedOption
      : selectedOption.label
    : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between min-w-0 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 transition-all hover:bg-neutral-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#88AB8E]/50 ${
          size === "sm" ? "h-9 px-3 text-xs" : "h-11 px-4 text-[15px]"
        } ${className}`}
      >
        <span
          className={`flex-1 text-left truncate ${value ? "text-neutral-900 dark:text-white" : "text-neutral-500"}`}
        >
          {displayValue}
        </span>
        <ChevronDown
          className={`shrink-0 text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${size === "sm" ? "w-3.5 h-3.5 ml-1" : "w-4 h-4 ml-2"}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 min-w-full mt-2 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 shadow-2xl z-60 animate-in fade-in zoom-in-95 duration-100 ${dropdownClassName}`}
        >
          <div className="max-h-[240px] overflow-y-auto">
            {options.map((opt) => {
              const optValue = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => {
                    onValueChange(optValue);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors whitespace-nowrap ${
                    value === optValue
                      ? "bg-[#88AB8E]/10 text-[#88AB8E] font-medium"
                      : "hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300"
                  } ${size === "sm" ? "py-2 text-xs" : "py-2.5 text-sm"}`}
                >
                  {optLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
