"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("has_completed_onboarding")
      .eq("id", user.id)
      .single();
    if (profile?.has_completed_onboarding) {
      router.push("/dashboard");
    } else {
      router.push("/onboarding/step-1");
    }
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 pt-12 pb-24 md:px-6 md:pt-16">
      <div className="mx-auto max-w-md md:max-w-lg">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-gray-600"
        >
          ← Back
        </Link>
        <Card className="shadow-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Log in</h1>
            <p className="text-sm text-gray-500">
              Enter your credentials to access CreditSmart.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Log in"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="font-medium text-cyan-500">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
