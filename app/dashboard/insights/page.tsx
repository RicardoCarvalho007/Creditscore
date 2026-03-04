import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-6 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-4xl lg:px-8">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-[#1a1a2e]">Insights</h1>
        <div className="w-10" />
      </header>
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center text-gray-500">
          <p>Trends and insights over time will appear here.</p>
          <Link href="/dashboard" className="mt-2 inline-block text-sm text-cyan-600">
            Back to Overview
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
