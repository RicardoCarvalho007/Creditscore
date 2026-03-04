"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/onboarding/step-1` },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSignedUpEmail(email);
    setNeedsConfirmation(true);
  }

  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50/80 px-4 pt-12 pb-24 md:px-6 md:pt-16">
        <div className="mx-auto max-w-md md:max-w-lg">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="mb-6 flex justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Mail className="h-7 w-7" />
                </span>
              </div>
              <h2 className="mb-2 text-center text-xl font-bold text-[#1a1a2e]">
                Confirm your email
              </h2>
              <p className="mb-6 text-center text-sm text-gray-600">
                We&apos;ve sent a confirmation link to{" "}
                <span className="font-medium text-[#1a1a2e]">{signedUpEmail}</span>.
                Please check your inbox and click the link to verify your account.
              </p>
              <p className="mb-6 text-center text-xs text-gray-500">
                Didn&apos;t get the email? Check your spam folder, or try signing up again with the same email.
              </p>
              <Link href="/auth/login" className="block">
                <Button className="w-full" size="lg">
                  I have confirmed my email — take me to Log in
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Create account</h1>
            <p className="text-sm text-gray-500">
              Sign up to get your AI-powered credit insights.
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
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account…" : "Sign up"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-cyan-500">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
