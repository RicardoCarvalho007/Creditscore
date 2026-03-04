"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="block w-full rounded-xl border border-red-200 bg-red-50 py-3 text-center text-sm font-medium text-red-700 hover:bg-red-100"
    >
      Sign out
    </button>
  );
}
