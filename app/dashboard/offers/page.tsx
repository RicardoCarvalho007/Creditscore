import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Car,
  Lock,
  TrendingUp,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OFFERS = [
  {
    id: "elite",
    type: "card",
    icon: CreditCard,
    name: "Elite Rewards Visa",
    status: "eligible" as const,
    apr: "14.9% – 22.9%",
    benefit: "3% Cashback",
    cta: "Apply Now",
  },
  {
    id: "loan",
    type: "loan",
    icon: Banknote,
    name: "Personal Loan €10k",
    status: "eligible" as const,
    apr: "From 8.49%",
    term: "60 Months",
    cta: "Get Funds",
  },
  {
    id: "auto",
    type: "auto",
    icon: Car,
    name: "Auto Refinance",
    status: "eligible" as const,
    apr: "4.25% APR",
    benefit: "New / Used",
    cta: "Shop Cars",
  },
];

export default async function OffersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: latestScore } = await supabase
    .from("credit_scores")
    .select("score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const score = latestScore?.score ?? 0;
  const eligibleCount = 3;
  const lockedCount = 1;

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
          Financial Offers
        </h1>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          aria-label="Filter"
        >
          <Filter className="h-5 w-5 text-gray-600" />
        </button>
      </header>

      <div className="mb-6 flex gap-2 border-b border-gray-100">
        <button
          type="button"
          className="border-b-2 border-cyan-500 pb-2 text-sm font-semibold text-cyan-600"
        >
          Eligible ({eligibleCount})
        </button>
        <button
          type="button"
          className="pb-2 text-sm font-medium text-gray-500"
        >
          Locked ({Math.max(0, lockedCount)})
        </button>
        <button type="button" className="pb-2 text-sm font-medium text-gray-500">
          Saved
        </button>
      </div>

      <Card className="mb-6 flex flex-row items-center gap-4 p-4 shadow-sm">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-2xl font-bold text-white">
          {score}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            AI Credit Score
          </p>
          <p className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            Improved by 12 pts
          </p>
        </div>
        <span className="text-xs text-gray-400">2m ago</span>
      </Card>

      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1a1a2e]">
        Top Picks
        <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
          High Likelihood
        </span>
      </h2>
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
        {OFFERS.map((offer) => (
          <Card key={offer.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                  <offer.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-emerald-600">
                    VERIFIED ELIGIBLE ✓
                  </p>
                  <h3 className="font-semibold text-[#1a1a2e]">
                    {offer.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>
                      {offer.apr.startsWith("From")
                        ? "FIXED RATES"
                        : "EST. APR"}
                      {" "}
                      {offer.apr}
                    </span>
                    <span>
                      {offer.term
                        ? `MAX TERM ${offer.term}`
                        : `MAIN BENEFIT ${offer.benefit}`}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full">{offer.cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-8 flex items-center gap-2 text-sm font-semibold text-[#1a1a2e]">
        Premium Access
        <Lock className="h-4 w-4 text-gray-400" />
      </h2>
      <Card className="border-gray-100 bg-gray-50/80 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">LOCKED OFFER</p>
            <h3 className="font-semibold text-[#1a1a2e]">
              Titanium Platinum
            </h3>
            <span className="mt-1 inline-flex items-center gap-1 rounded-lg bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
              TARGET SCORE 750+
              <TrendingUp className="h-3 w-3" />
            </span>
          </div>
          <Link href="/dashboard/plan">
            <Button variant="outline" size="sm">
              Boost Score →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
