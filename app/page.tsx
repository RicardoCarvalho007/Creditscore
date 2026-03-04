import Link from "next/link";
import { Sparkles, TrendingUp, Wallet, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingRedirect } from "@/components/LandingRedirect";

export default function HomePage() {
  return (
    <>
      <LandingRedirect />
      <div className="min-h-screen bg-gray-50/80 pb-12">
        <div className="mx-auto max-w-md px-4 pt-6 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-4xl lg:px-8 lg:pt-12">
          <header className="mb-8 flex items-center justify-between md:mb-10">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 text-white md:h-10 md:w-10">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
              </span>
              <span className="text-xl font-semibold text-[#1a1a2e] md:text-2xl">
                CreditSmart
              </span>
            </div>
            <Link
              href="/auth/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white/80 hover:text-[#1a1a2e] md:px-4 md:py-2.5"
            >
              Log In
            </Link>
          </header>

          <Card className="mb-8 overflow-hidden shadow-md md:mb-10 lg:mb-12">
            <CardContent className="p-6 md:p-8 lg:p-10">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                FINANCIAL FUTURE SECURED
              </span>
              <h1 className="mb-2 text-2xl font-bold leading-tight text-[#1a1a2e] md:text-3xl lg:text-4xl">
                Unlock Your{" "}
                <span className="text-blue-700">Premium Credit</span> Power
              </h1>
              <p className="mb-6 text-sm text-gray-500 md:text-base lg:mb-8">
                Experience AI-enhanced pre-qualification in a sunlit world of
                financial clarity.
              </p>
              <Link href="/auth/signup" className="block">
                <Button className="w-full" size="lg">
                  Get Started
                </Button>
              </Link>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Lock className="h-3.5 w-3.5" />
                Safe • Secure • No Impact to Score
              </p>
            </CardContent>
          </Card>

          <div className="mb-10 space-y-4 md:mb-12 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
            <Card className="shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-[#1a1a2e]">AI Scoring</h3>
                  <p className="text-sm text-gray-500">
                    Vibrant real-time updates on your financial trajectory.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Wallet className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-[#1a1a2e]">Pre-Qualified</h3>
                  <p className="text-sm text-gray-500">
                    Exclusive access to premium rates and rewards.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Star className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-[#1a1a2e]">Smart Roadmap</h3>
                  <p className="text-sm text-gray-500">
                    Steps to reach the soft glow of financial freedom.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="mb-6 text-lg font-semibold text-[#1a1a2e] md:text-xl">
            How it Works
          </h2>
          <div className="mb-12 flex gap-4 md:gap-6 lg:gap-8">
            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-600">
                1
              </span>
              <div className="my-1 h-12 w-px bg-gray-200" />
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                2
              </span>
              <div className="my-1 h-12 w-px bg-gray-200" />
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
                3
              </span>
            </div>
            <div className="flex-1 space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
              <Card className="shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <h3 className="font-semibold text-[#1a1a2e]">Secure Scan</h3>
                  <p className="text-sm text-gray-500">
                    Encrypted AI analysis of your financial profile.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <h3 className="font-semibold text-[#1a1a2e]">Instant Insights</h3>
                  <p className="text-sm text-gray-500">
                    Receive your AI-enhanced score and offers.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <h3 className="font-semibold text-[#1a1a2e]">Growth Plan</h3>
                  <p className="text-sm text-gray-500">
                    Custom path to your premium financial status.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
