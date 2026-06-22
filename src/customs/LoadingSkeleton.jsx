import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* Personal Information Skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
          <Skeleton className="h-5 w-40 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agencies Skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
          <Skeleton className="h-5 w-32 mb-4" />

          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>

                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingSkeleton;
