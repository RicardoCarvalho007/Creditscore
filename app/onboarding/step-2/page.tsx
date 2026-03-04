"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const EMPLOYMENT = [
  { value: "employed", label: "Employed" },
  { value: "self_employed", label: "Self-Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "student", label: "Student" },
  { value: "retired", label: "Retired" },
];

export default function OnboardingStep2Page() {
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [monthlyHousingPayment, setMonthlyHousingPayment] = useState("");
  const [yearsAtCurrentJob, setYearsAtCurrentJob] = useState("");
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
    await supabase.from("financial_profiles").upsert(
      {
        user_id: user.id,
        employment_status: employmentStatus || null,
        annual_income: annualIncome ? parseFloat(annualIncome) : null,
        monthly_housing_payment: monthlyHousingPayment
          ? parseFloat(monthlyHousingPayment)
          : null,
        years_at_current_job: yearsAtCurrentJob
          ? parseFloat(yearsAtCurrentJob)
          : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    setLoading(false);
    router.push("/onboarding/step-3");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 pt-6 pb-28 md:px-6 md:pt-8">
      <div className="mx-auto max-w-md md:max-w-lg">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/onboarding/step-1"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <p className="text-sm font-medium text-gray-500">STEP 2 OF 3</p>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">
          Employment & Income
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Help us understand your financial foundation.
        </p>
        <div className="my-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
            style={{ width: "66.66%" }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Employment Status
                </label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                >
                  <option value="">Select</option>
                  {EMPLOYMENT.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Annual Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="0"
                    className="pl-7"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Rent or Mortgage (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    placeholder="0"
                    className="pl-7"
                    value={monthlyHousingPayment}
                    onChange={(e) => setMonthlyHousingPayment(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Years at Current Job
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="0"
                  value={yearsAtCurrentJob}
                  onChange={(e) => setYearsAtCurrentJob(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Saving…" : "Continue →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
