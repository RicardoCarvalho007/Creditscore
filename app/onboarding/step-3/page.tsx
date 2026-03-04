"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function OnboardingStep3Page() {
  const [totalOutstandingDebt, setTotalOutstandingDebt] = useState("");
  const [numberOfCreditAccounts, setNumberOfCreditAccounts] = useState("");
  const [missedPaymentsLast12Months, setMissedPaymentsLast12Months] =
    useState("");
  const [creditHistoryLengthYears, setCreditHistoryLengthYears] = useState("");
  const [monthlyCreditCardSpending, setMonthlyCreditCardSpending] = useState("");
  const [totalCreditLimit, setTotalCreditLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/auth/login");
    });
  }, [router, supabase.auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const financial = {
      total_outstanding_debt: totalOutstandingDebt
        ? parseFloat(totalOutstandingDebt)
        : null,
      number_of_credit_accounts: numberOfCreditAccounts
        ? parseInt(numberOfCreditAccounts, 10)
        : null,
      missed_payments_last_12_months: missedPaymentsLast12Months
        ? parseInt(missedPaymentsLast12Months, 10)
        : null,
      credit_history_length_years: creditHistoryLengthYears
        ? parseFloat(creditHistoryLengthYears)
        : null,
      monthly_credit_card_spending: monthlyCreditCardSpending
        ? parseFloat(monthlyCreditCardSpending)
        : null,
      total_credit_limit: totalCreditLimit
        ? parseFloat(totalCreditLimit)
        : null,
      updated_at: new Date().toISOString(),
    };
    await supabase
      .from("financial_profiles")
      .upsert({ user_id: user.id, ...financial }, { onConflict: "user_id" });
    await supabase
      .from("profiles")
      .update({
        has_completed_onboarding: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    try {
      const res = await fetch("/api/calculate-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.scoreId) {
          await fetch("/api/ai-summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scoreId: data.scoreId }),
          }).catch(() => {});
          await fetch("/api/ai-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scoreId: data.scoreId }),
          }).catch(() => {});
        }
      }
    } catch {
      // continue to dashboard even if score/ai fail
    }
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 pt-6 pb-28 md:px-6 md:pt-8">
      <div className="mx-auto max-w-md md:max-w-lg">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/onboarding/step-2"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <p className="text-sm font-medium text-gray-500">STEP 3 OF 3</p>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">
          Credit & Debt Details
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Final step — this powers your AI credit analysis.
        </p>
        <div className="my-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
            style={{ width: "100%" }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Total Outstanding Debt (€) — loans + cards
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    className="pl-7"
                    value={totalOutstandingDebt}
                    onChange={(e) => setTotalOutstandingDebt(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Number of Credit Accounts
                </label>
                <Input
                  type="number"
                  min={0}
                  value={numberOfCreditAccounts}
                  onChange={(e) => setNumberOfCreditAccounts(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Missed Payments in Last 12 Months
                </label>
                <Input
                  type="number"
                  min={0}
                  value={missedPaymentsLast12Months}
                  onChange={(e) =>
                    setMissedPaymentsLast12Months(e.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Credit History Length (years)
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={creditHistoryLengthYears}
                  onChange={(e) =>
                    setCreditHistoryLengthYears(e.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Monthly Credit Card Spending (€)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step={50}
                    className="pl-7"
                    value={monthlyCreditCardSpending}
                    onChange={(e) =>
                      setMonthlyCreditCardSpending(e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Total Credit Limit (€) — across all cards
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step={500}
                    className="pl-7"
                    value={totalCreditLimit}
                    onChange={(e) => setTotalCreditLimit(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Calculating…" : "Calculate My Score →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
