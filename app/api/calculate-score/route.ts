import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ScoreBreakdown = {
  payment_history: number;
  credit_utilization: number;
  credit_history: number;
  credit_mix: number;
  debt_to_income: number;
};

function calculateCreditScore(financial: {
  missed_payments_last_12_months: number | null;
  monthly_credit_card_spending: number | null;
  total_credit_limit: number | null;
  credit_history_length_years: number | null;
  number_of_credit_accounts: number | null;
  total_outstanding_debt: number | null;
  annual_income: number | null;
}): { score: number; rating: string; breakdown: ScoreBreakdown } {
  const missed = financial.missed_payments_last_12_months ?? 0;
  const paymentHistory =
    missed === 0 ? 100 : missed === 1 ? 80 : missed === 2 ? 60 : missed === 3 ? 40 : 20;

  const limit = financial.total_credit_limit ?? 1;
  const spending = financial.monthly_credit_card_spending ?? 0;
  const utilizationPct = limit > 0 ? (spending / limit) * 100 : 0;
  const creditUtilization =
    utilizationPct < 10 ? 100 : utilizationPct < 20 ? 90 : utilizationPct < 30 ? 80 : utilizationPct < 50 ? 60 : utilizationPct < 75 ? 40 : 20;

  const years = financial.credit_history_length_years ?? 0;
  const creditHistory =
    years > 10 ? 100 : years > 7 ? 85 : years > 5 ? 70 : years > 3 ? 55 : years > 1 ? 40 : 25;

  const accounts = financial.number_of_credit_accounts ?? 0;
  const creditMix =
    (accounts >= 4 && accounts <= 6) ? 100 : (accounts === 3 || accounts === 7) ? 80 : (accounts === 2 || accounts === 8) ? 60 : (accounts === 1 || accounts >= 9) ? 40 : 20;

  const annualIncome = financial.annual_income ?? 1;
  const debt = financial.total_outstanding_debt ?? 0;
  const dtiRatio = annualIncome > 0 ? debt / annualIncome : 0;
  const debtToIncome =
    dtiRatio < 0.15 ? 100 : dtiRatio < 0.3 ? 80 : dtiRatio < 0.4 ? 65 : dtiRatio < 0.5 ? 45 : 25;

  const total =
    paymentHistory * 0.35 +
    creditUtilization * 0.3 +
    creditHistory * 0.15 +
    creditMix * 0.1 +
    debtToIncome * 0.1;
  const score = Math.round(300 + (total / 100) * 550);
  const clamped = Math.min(850, Math.max(300, score));

  let rating: string;
  if (clamped >= 800) rating = "Excellent";
  else if (clamped >= 740) rating = "Very Good";
  else if (clamped >= 670) rating = "Good";
  else if (clamped >= 580) rating = "Fair";
  else rating = "Poor";

  return {
    score: clamped,
    rating,
    breakdown: {
      payment_history: Math.round(paymentHistory),
      credit_utilization: Math.round(creditUtilization),
      credit_history: Math.round(creditHistory),
      credit_mix: Math.round(creditMix),
      debt_to_income: Math.round(debtToIncome),
    },
  };
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: financial, error: finError } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (finError || !financial) {
    return NextResponse.json(
      { error: "Financial profile not found" },
      { status: 400 }
    );
  }

  const result = calculateCreditScore(financial);
  const admin = createAdminClient();
  const { data: scoreRow, error: insertError } = await admin
    .from("credit_scores")
    .insert({
      user_id: user.id,
      score: result.score,
      rating: result.rating,
      score_breakdown: result.breakdown,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    score: result.score,
    rating: result.rating,
    breakdown: result.breakdown,
    scoreId: scoreRow?.id,
  });
}
