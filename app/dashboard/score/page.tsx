import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreGauge } from "@/components/ScoreGauge";
import { DashboardAiSummary } from "@/components/DashboardAiSummary";

function ratingLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Fair";
  return "Poor";
}

export default async function ScorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: latestScore } = await supabase
    .from("credit_scores")
    .select("id, score, rating, ai_summary, score_breakdown, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const breakdown = (latestScore?.score_breakdown ?? {}) as Record<
    string,
    number
  >;
  const categories = [
    { key: "payment_history", label: "Payment History" },
    { key: "credit_utilization", label: "Credit Utilization" },
    { key: "credit_history", label: "Credit History Length" },
    { key: "credit_mix", label: "Credit Mix" },
    { key: "debt_to_income", label: "Debt-to-Income Ratio" },
  ];

  return (
    <div className="mx-auto max-w-md px-4 pt-6 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-4xl lg:px-8">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-[#1a1a2e]">Credit Score</h1>
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </header>

      {latestScore ? (
        <>
          <div className="mb-6 flex flex-col lg:mb-8 lg:flex-row lg:items-start lg:gap-8">
            <div className="flex flex-col items-center lg:shrink-0">
              <ScoreGauge
                score={latestScore.score}
                rating={latestScore.rating}
                size={220}
              />
              <div className="mt-4 flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  TransUnion
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  Equifax
                </span>
              </div>
            </div>
            <div className="mt-6 min-w-0 flex-1 lg:mt-0">
              <DashboardAiSummary
                scoreId={latestScore.id}
                aiSummary={latestScore.ai_summary}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1a1a2e]">
                Score Breakdown
              </h2>
              <span className="text-xs text-gray-400">REFRESHED</span>
            </div>
            <div className="space-y-3">
              {categories.map(({ key, label }) => {
                const value = breakdown[key] ?? 0;
                const rating = ratingLabel(value);
                const isExcellent = rating === "Excellent";
                const isGood = rating === "Good";
                const isFair = rating === "Fair";
                const barColor = isExcellent
                  ? "bg-emerald-500"
                  : isGood || isFair
                    ? "bg-amber-500"
                    : "bg-red-500";
                const textColor = isExcellent
                  ? "text-emerald-600"
                  : isGood
                    ? "text-cyan-600"
                    : isFair
                      ? "text-amber-600"
                      : "text-red-600";
                return (
                  <Card key={key} className="shadow-sm">
                    <CardContent className="py-3 px-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[#1a1a2e]">
                          {label}
                        </span>
                        <span className={`text-xs font-semibold ${textColor}`}>
                          {value}/100 · {rating.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-[width] duration-500 ${barColor}`}
                          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">
              No score yet. Complete onboarding to see your AI credit score.
            </p>
            <Link
              href="/onboarding/step-1"
              className="mt-4 inline-block text-sm font-medium text-cyan-600"
            >
              Go to Onboarding →
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
