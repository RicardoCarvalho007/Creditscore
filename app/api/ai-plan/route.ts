import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const scoreId = body.scoreId as string | undefined;
  if (!scoreId) {
    return NextResponse.json(
      { error: "scoreId required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data: score, error: scoreError } = await admin
    .from("credit_scores")
    .select("score, rating, score_breakdown")
    .eq("id", scoreId)
    .eq("user_id", user.id)
    .single();

  if (scoreError || !score) {
    return NextResponse.json(
      { error: "Score not found" },
      { status: 404 }
    );
  }

  const { data: financial } = await admin
    .from("financial_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const breakdown = (score.score_breakdown ?? {}) as Record<string, number>;
  const limit = (financial?.total_credit_limit as number) ?? 1;
  const spending = (financial?.monthly_credit_card_spending as number) ?? 0;
  const utilizationPercent =
    limit > 0 ? Math.round((spending / limit) * 100) : 0;
  const annualIncome = (financial?.annual_income as number) ?? 1;
  const debt = (financial?.total_outstanding_debt as number) ?? 0;
  const dtiPercent =
    annualIncome > 0 ? Math.round((debt / annualIncome) * 100) : 0;

  const prompt = `You are a financial advisor AI for CreditSmart.

Given this user's credit profile:
- Score: ${score.score}/850 (${score.rating})
- Payment History Score: ${breakdown.payment_history ?? 0}/100
- Credit Utilization Score: ${breakdown.credit_utilization ?? 0}/100
- Credit History Score: ${breakdown.credit_history ?? 0}/100
- Credit Mix Score: ${breakdown.credit_mix ?? 0}/100
- Debt-to-Income Score: ${breakdown.debt_to_income ?? 0}/100
- Missed Payments (12mo): ${financial?.missed_payments_last_12_months ?? 0}
- Credit Utilization: ${utilizationPercent}%
- Debt-to-Income Ratio: ${dtiPercent}%

Generate exactly 5 personalized improvement tasks. Return ONLY a valid JSON array, no markdown, no code fences:
[
  { "task": "specific actionable advice", "impact": "HIGH" },
  { "task": "specific actionable advice", "impact": "HIGH" },
  { "task": "specific actionable advice", "impact": "MEDIUM" },
  { "task": "specific actionable advice", "impact": "MEDIUM" },
  { "task": "specific actionable advice", "impact": "LOW" }
]

Rules:
- Tasks must be specific to THIS user's weak areas
- If payment history is weak, include autopay setup
- If utilization is high, include spending reduction targets with specific percentages
- If credit history is short, suggest patience-based strategies
- Make tasks actionable and concrete, not generic
- Order by impact (highest first)`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const rawBody = await response.text();
  let data: { content?: Array<{ text?: string }>; error?: { message?: string; type?: string } };
  try {
    data = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid Anthropic response", details: rawBody.slice(0, 300) },
      { status: 502 }
    );
  }

  if (!response.ok) {
    const errMsg = data?.error?.message ?? data?.error?.type ?? rawBody;
    return NextResponse.json(
      { error: "Anthropic API error", details: errMsg },
      { status: 502 }
    );
  }

  let text = data?.content?.[0]?.text?.trim() ?? "";
  text = text.replace(/^```\w*\n?|\n?```$/g, "").trim();
  let tasks: { task: string; impact: string }[];
  try {
    tasks = JSON.parse(text);
    if (!Array.isArray(tasks) || tasks.length === 0) {
      throw new Error("Invalid array");
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid AI response format" },
      { status: 502 }
    );
  }

  for (const t of tasks.slice(0, 5)) {
    const impact = ["HIGH", "MEDIUM", "LOW"].includes(t.impact)
      ? t.impact
      : "MEDIUM";
    await admin.from("improvement_tasks").insert({
      user_id: user.id,
      score_id: scoreId,
      task_text: t.task || "Improve your credit habits",
      impact_level: impact,
    });
  }

  return NextResponse.json({ tasks: tasks.slice(0, 5) });
}
