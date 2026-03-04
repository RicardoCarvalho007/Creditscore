"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Info } from "lucide-react";

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];
const MARITAL = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];
const EDUCATION = [
  { value: "high_school", label: "High School" },
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "doctorate", label: "Doctorate" },
  { value: "other", label: "Other" },
];

export default function OnboardingStep1Page() {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [numberOfDependents, setNumberOfDependents] = useState(0);
  const [educationLevel, setEducationLevel] = useState("");
  const [residentialStatus, setResidentialStatus] = useState<"home_owner" | "renting" | "">("");
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
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName || null,
      age: age ? parseInt(age, 10) : null,
      gender: gender || null,
      marital_status: maritalStatus || null,
      number_of_dependents: numberOfDependents,
      education_level: educationLevel || null,
      residential_status: residentialStatus || null,
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
    router.push("/onboarding/step-2");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 pt-6 pb-28 md:px-6 md:pt-8">
      <div className="mx-auto max-w-md md:max-w-lg">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <p className="text-sm font-medium text-gray-500">STEP 1 OF 3</p>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Personal Details</h1>
        <p className="mt-1 text-sm text-gray-500">
          Let&apos;s get started with your basic information to tailor your AI
          credit profile.
        </p>
        <div className="my-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
            style={{ width: "33.33%" }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                  Full Name <Info className="h-3.5 w-3.5 text-gray-400" />
                </label>
                <Input
                  placeholder="e.g. Michael Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Age
                </label>
                <Input
                  type="number"
                  min={18}
                  max={120}
                  placeholder="28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Gender
                </label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  {GENDERS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Marital Status
                </label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                >
                  <option value="">Choose option</option>
                  {MARITAL.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                  Number of Dependents <Info className="h-3.5 w-3.5 text-gray-400" />
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setNumberOfDependents((n) => Math.max(0, n - 1))
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center font-medium text-[#1a1a2e]">
                    {numberOfDependents}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNumberOfDependents((n) => n + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Education Level
                </label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                >
                  <option value="">Select Level</option>
                  {EDUCATION.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Residential Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResidentialStatus("home_owner")}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                      residentialStatus === "home_owner"
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Home Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => setResidentialStatus("renting")}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                      residentialStatus === "renting"
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Renting
                  </button>
                </div>
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
