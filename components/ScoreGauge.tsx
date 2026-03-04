"use client";

import { useEffect, useState } from "react";

export function ScoreGauge({
  score,
  rating,
  size = 200,
}: {
  score: number;
  rating: string;
  size?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const percent = (score - 300) / (850 - 300);
  const dashOffset = 283 - 283 * (mounted ? percent : 0);

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="gauge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gauge)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums text-[#1a1a2e]">
          {score}
        </span>
        <span
          className={`mt-1 rounded-full px-3 py-0.5 text-xs font-semibold text-white ${
            rating === "Poor"
              ? "bg-red-500"
              : rating === "Fair"
                ? "bg-amber-500"
                : "bg-violet-500"
          }`}
        >
          {rating.toUpperCase()}
        </span>
        <span className="mt-1 text-xs text-gray-500">SCORE OUT OF 850</span>
      </div>
    </div>
  );
}
