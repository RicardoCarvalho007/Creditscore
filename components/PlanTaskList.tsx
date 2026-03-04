"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  task_text: string;
  impact_level: string;
  is_completed: boolean;
};

export function PlanTaskList({ tasks }: { tasks: Task[] }) {
  const [localTasks, setLocalTasks] = useState(tasks);
  const supabase = createClient();

  async function toggleComplete(id: string, current: boolean) {
    const next = !current;
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_completed: next } : t))
    );
    await supabase
      .from("improvement_tasks")
      .update({ is_completed: next })
      .eq("id", id);
  }

  if (localTasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center text-sm text-gray-500">
        No improvement tasks yet. Complete onboarding and get your score to see
        your personalized plan.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localTasks.map((task) => (
        <Card key={task.id} className="shadow-sm">
          <CardContent className="flex items-start gap-3 p-4">
            <button
              type="button"
              onClick={() => toggleComplete(task.id, task.is_completed)}
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                task.is_completed
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-gray-300 bg-white"
              )}
            >
              {task.is_completed && (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium text-[#1a1a2e]",
                  task.is_completed && "line-through text-gray-500"
                )}
              >
                {task.task_text}
              </p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                  task.impact_level === "HIGH" &&
                    "bg-emerald-100 text-emerald-700",
                  task.impact_level === "MEDIUM" &&
                    "bg-amber-100 text-amber-700",
                  task.impact_level === "LOW" && "bg-gray-100 text-gray-600"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                {task.impact_level} IMPACT
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
