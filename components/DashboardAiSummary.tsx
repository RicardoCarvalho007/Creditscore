"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  scoreId: string;
  aiSummary: string | null;
};

export function DashboardAiSummary({ scoreId, aiSummary }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    aiSummary ? "done" : "idle"
  );
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (aiSummary || !scoreId || requested.current) return;
    requested.current = true;
    setStatus("loading");
    fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scoreId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorDetail(data?.details ?? data?.error ?? res.statusText);
          setStatus("error");
          return;
        }
        router.refresh();
        setStatus("done");
      })
      .catch((err) => {
        console.error("[DashboardAiSummary] fetch error:", err);
        setErrorDetail(String(err));
        setStatus("error");
      });
  }, [scoreId, aiSummary, router]);

  const displayText =
    aiSummary ||
    (status === "loading" && "Generating your summary…") ||
    (status === "error" && `Could not generate summary. ${errorDetail ?? "Try refreshing."}`) ||
    "Your credit score is being analyzed. Check back in a moment for your personalized summary.";

  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-5">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-[#1a1a2e]">
          <Sparkles className="h-4 w-4 text-amber-500" />
          AI-Generated Summary
        </h3>
        <p
          className={`text-sm leading-relaxed ${
            status === "error" ? "text-amber-700" : "text-gray-600"
          }`}
        >
          {displayText}
        </p>
        <Link
          href="/dashboard/offers"
          className="mt-3 flex items-center gap-1 text-sm text-gray-500 hover:text-cyan-600"
        >
          4 New pre-qualifications found
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
