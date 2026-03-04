import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Bell, BarChart3, ClipboardList, Tag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function firstSentence(text: string | null): string {
  if (!text || !text.trim()) return "";
  const trimmed = text.trim();
  const match = trimmed.match(/^[^.!?]+[.!?]?/);
  return match ? match[0].trim() : trimmed.slice(0, 120) + (trimmed.length > 120 ? "…" : "");
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: latestScore } = await supabase
    .from("credit_scores")
    .select("id, score, rating, ai_summary")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const displayName =
    profile?.full_name?.trim() ||
    user.email?.split("@")[0] ||
    "there";
  const aiSnippet = firstSentence(latestScore?.ai_summary ?? null);

  return (
    <div className="mx-auto max-w-md px-4 pt-6 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-4xl lg:px-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[#1a1a2e]">CreditSmart</h1>
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </header>

      <p className="mb-6 text-xl font-semibold text-[#1a1a2e]">
        Hello, {displayName}
      </p>

      {latestScore ? (
        <>
          <Card className="mb-6 shadow-sm">
            <CardContent className="flex flex-row items-center gap-4 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-2xl font-bold text-white">
                {latestScore.score}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Credit Score
                </p>
                <span className="inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                  {latestScore.rating}
                </span>
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Improved by 12 pts
                </p>
              </div>
            </CardContent>
          </Card>

          {aiSnippet ? (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-semibold text-[#1a1a2e]">
                AI Insight
              </h2>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {aiSnippet}
                  </p>
                  <Link
                    href="/dashboard/score"
                    className="mt-2 inline-block text-xs font-medium text-cyan-600"
                  >
                    See full summary →
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : null}

          <h2 className="mb-3 text-sm font-semibold text-[#1a1a2e]">
            Quick actions
          </h2>
          <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Link href="/dashboard/score">
              <Card className="shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#1a1a2e]">Score</p>
                    <p className="text-xs text-gray-500">
                      Full gauge, summary & breakdown
                    </p>
                  </div>
                  <span className="text-gray-400">→</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/plan">
              <Card className="shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <ClipboardList className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#1a1a2e]">Plan</p>
                    <p className="text-xs text-gray-500">
                      AI improvement tasks
                    </p>
                  </div>
                  <span className="text-gray-400">→</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/offers">
              <Card className="shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                    <Tag className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#1a1a2e]">Offers</p>
                    <p className="text-xs text-gray-500">
                      Pre-qualified financial offers
                    </p>
                  </div>
                  <span className="text-gray-400">→</span>
                </CardContent>
              </Card>
            </Link>
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
