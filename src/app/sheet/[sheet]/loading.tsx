import { Search } from "lucide-react";

export default function Loading() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="mb-6 px-1">
          {/* Header Skeleton */}
          <div className="h-10 md:h-12 w-48 bg-gray-200 dark:bg-white/10 rounded-lg mb-4"></div>
          
          {/* Progress Bar Skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-gray-300 dark:bg-white/20 w-1/3 rounded-full"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-4">
          {/* Filter Controls Bar Skeleton */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-3 bg-white dark:bg-[#272627]/50 border border-neutral-200 dark:border-white/10 p-2 lg:p-2 rounded-2xl shadow-sm">
            
            {/* Search Input Skeleton */}
            <div className="relative flex-1 lg:flex-initial lg:w-[240px] group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 dark:text-neutral-600" />
              <div className="w-full pl-9 h-9 bg-gray-100 dark:bg-white/5 rounded-md"></div>
            </div>

            <div className="hidden lg:block w-px h-5 bg-neutral-200 dark:bg-white/10 shrink-0"></div>

            <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-2 lg:gap-3">
              <div className="w-full lg:w-[150px] h-9 bg-gray-100 dark:bg-white/5 rounded-md"></div>
              <div className="hidden lg:block w-px h-5 bg-neutral-200 dark:bg-white/10 shrink-0"></div>
              <div className="w-full lg:w-[150px] h-9 bg-gray-100 dark:bg-white/5 rounded-md"></div>
            </div>

            <div className="hidden lg:block flex-1"></div>

            {/* Buttons Skeleton */}
            <div className="grid grid-cols-2 lg:flex items-center gap-2 lg:gap-3 lg:pr-1">
              <div className="h-9 w-full lg:w-28 bg-gray-100 dark:bg-white/5 rounded-xl"></div>
              <div className="h-9 w-full lg:w-28 bg-gray-100 dark:bg-white/5 rounded-xl"></div>
            </div>
          </div>

          {/* Topic Sections Skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#272627]/50 border border-neutral-200 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-3/4 max-w-[200px] bg-gray-200 dark:bg-white/10 rounded-md"></div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 max-w-[200px]"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-white/10 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
