import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PlanPageContent } from "@/components/PlanPageContent";

export default async function PlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: latestScore } = await supabase
    .from("credit_scores")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: tasks } = await supabase
    .from("improvement_tasks")
    .select("id, task_text, impact_level, is_completed")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(10);

  const taskList = tasks ?? [];

  return (
    <div className="mx-auto max-w-md px-4 pt-6 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-4xl lg:px-8">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-[#1a1a2e]">
          AI Improvement Plan
        </h1>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </button>
      </header>

      <div className="mb-8 flex flex-col items-center text-center">
        <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500 text-2xl text-white">
          ✨
        </span>
        <h2 className="text-xl font-bold text-[#1a1a2e]">Boost Your Score</h2>
        <p className="mt-1 text-sm text-gray-500">
          Our AI identified {taskList.length || 5} strategic actions tailored to
          your financial profile.
        </p>
      </div>

      <PlanPageContent scoreId={latestScore?.id ?? null} initialTasks={taskList} />

      <Card className="my-6 bg-gradient-to-r from-emerald-400/20 to-cyan-500/20 shadow-sm">
        <CardContent className="flex gap-3 p-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-emerald-600">
            💡
          </span>
          <div>
            <p className="text-sm font-medium text-[#1a1a2e]">
              Pro Tip: Users who complete at least 3 tasks see an average score
              increase of <span className="font-bold text-emerald-600">25 points</span> within 90 days.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs italic text-gray-400">
        Disclaimer: This is educational information, not financial advice. Credit
        score results may vary and are not guaranteed.
      </p>
    </div>
  );
}
