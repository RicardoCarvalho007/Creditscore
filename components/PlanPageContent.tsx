"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PlanTaskList } from "@/components/PlanTaskList";

type Task = {
  id: string;
  task_text: string;
  impact_level: string;
  is_completed: boolean;
};

type Props = {
  scoreId: string | null;
  initialTasks: Task[];
};

export function PlanPageContent({ scoreId, initialTasks }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    initialTasks.length > 0 ? "done" : scoreId ? "idle" : "done"
  );
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (initialTasks.length > 0 || !scoreId || requested.current) return;
    requested.current = true;
    setStatus("loading");
    fetch("/api/ai-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scoreId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorDetail(data?.details ?? data?.error ?? res.statusText);
          setStatus("error");
          return;
        }
        router.refresh();
        setStatus("done");
      })
      .catch((err) => {
        setErrorDetail(String(err));
        setStatus("error");
      });
  }, [scoreId, initialTasks.length, router]);

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center text-sm text-gray-500">
        Generating your personalized plan…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-center text-sm text-amber-800">
        Could not generate plan. {errorDetail ?? "Try refreshing."}
      </div>
    );
  }

  return <PlanTaskList tasks={initialTasks} />;
}
