"use client";

import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  correctCount: number;
  showStreak?: boolean;
  streak?: number;
}

export function ProgressBar({
  current,
  total,
  correctCount,
  showStreak = true,
  streak = 0,
}: ProgressBarProps) {
  const percentage = (current / total) * 100;
  const accuracy = current > 0 ? Math.round((correctCount / current) * 100) : 0;

  return (
    <div className="space-y-2">
      {/* Stats row */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Unit {current + 1} of {total}
        </span>
        <div className="flex items-center gap-4">
          {current > 0 && (
            <span className="text-gray-400">
              Accuracy: <span className="text-white">{accuracy}%</span>
            </span>
          )}
          {showStreak && streak > 0 && (
            <span className="text-orange-400">
              🔥 {streak} streak
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00ff87] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Unit indicators */}
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full ${
              i < current
                ? "bg-[#00ff87]"
                : i === current
                ? "bg-[#00ff87]/50 animate-pulse"
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
