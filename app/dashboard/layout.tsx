import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/DashboardNav";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("has_completed_onboarding")
    .eq("id", user.id)
    .single();
  if (!profile?.has_completed_onboarding) {
    redirect("/onboarding/step-1");
  }
  return (
    <div className="min-h-screen bg-gray-50/80 pb-20 md:pb-0">
      <DashboardSidebar />
      <main className="md:ml-56">
        {children}
      </main>
      <DashboardNav />
    </div>
  );
}
