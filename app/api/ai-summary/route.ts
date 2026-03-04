import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  console.log("[ai-summary] POST called");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log("[ai-summary] Unauthorized: no user");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch((e) => {
    console.error("[ai-summary] Failed to parse body:", e);
    return {};
  });
  const scoreId = body.scoreId as string | undefined;
  console.log("[ai-summary] scoreId from body:", scoreId ?? "(missing)");
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
    console.error("[ai-summary] Score not found:", scoreError?.message ?? "no row");
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
  const prompt = `You are a friendly financial advisor AI inside a credit score app called CreditSmart.

Given this user's financial profile:
- Credit Score: ${score.score} / 850 (${score.rating})
- Payment History: ${breakdown.payment_history ?? 0}/100
- Credit Utilization: ${breakdown.credit_utilization ?? 0}/100
- Credit History Length: ${breakdown.credit_history ?? 0}/100
- Credit Mix: ${breakdown.credit_mix ?? 0}/100
- Debt-to-Income: ${breakdown.debt_to_income ?? 0}/100

Financial data:
- Annual Income: €${financial?.annual_income ?? "—"}
- Total Debt: €${financial?.total_outstanding_debt ?? "—"}
- Monthly Credit Card Spending: €${financial?.monthly_credit_card_spending ?? "—"}
- Total Credit Limit: €${financial?.total_credit_limit ?? "—"}
- Missed Payments (12mo): ${financial?.missed_payments_last_12_months ?? "—"}
- Credit History: ${financial?.credit_history_length_years ?? "—"} years
- Credit Accounts: ${financial?.number_of_credit_accounts ?? "—"}

Write a 2-3 sentence summary for the user. Mention their percentile estimate, their strongest category, and one specific action to improve. Be encouraging but honest. Do NOT use markdown formatting.`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const hasKey = Boolean(apiKey);
  console.log("[ai-summary] ANTHROPIC_API_KEY loaded from env:", hasKey);
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  console.log("[ai-summary] Calling Anthropic messages API...");
  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
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
  } catch (fetchError) {
    console.error("[ai-summary] Anthropic fetch threw:", fetchError);
    return NextResponse.json(
      { error: "Anthropic request failed", details: String(fetchError) },
      { status: 502 }
    );
  }

  const rawBody = await response.text();
  let data: { content?: Array<{ text?: string }>; error?: { message?: string; type?: string } };
  try {
    data = JSON.parse(rawBody);
  } catch (parseError) {
    console.error("[ai-summary] Failed to parse Anthropic response as JSON:", parseError);
    return NextResponse.json(
      { error: "Invalid Anthropic response", details: rawBody.slice(0, 300) },
      { status: 502 }
    );
  }

  if (!response.ok) {
    const errMsg = data?.error?.message ?? data?.error?.type ?? rawBody;
    console.error("[ai-summary] Anthropic API error:", response.status, errMsg);
    return NextResponse.json(
      { error: "Anthropic API error", details: errMsg },
      { status: 502 }
    );
  }

  const text = data?.content?.[0]?.text?.trim() ?? "";
  console.log("[ai-summary] Anthropic response parsed:", { textLength: text.length });
  if (!text) {
    console.error("[ai-summary] Empty AI text in response. Full response (truncated):", rawBody.slice(0, 500));
    return NextResponse.json(
      { error: "Empty AI response" },
      { status: 502 }
    );
  }

  const { error: updateError } = await admin
    .from("credit_scores")
    .update({ ai_summary: text })
    .eq("id", scoreId)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("[ai-summary] Failed to save ai_summary to DB:", updateError.message);
    return NextResponse.json(
      { error: "Failed to save summary" },
      { status: 500 }
    );
  }
  console.log("[ai-summary] Success, saved for scoreId:", scoreId);
  return NextResponse.json({ ai_summary: text });
}
