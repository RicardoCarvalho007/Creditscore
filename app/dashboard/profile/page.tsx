import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SignOutButton } from "@/components/SignOutButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, age, created_at")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-md px-4 pt-6 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-4xl lg:px-8">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-[#1a1a2e]">Profile</h1>
        <div className="w-10" />
      </header>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <User className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-semibold text-[#1a1a2e]">
                {profile?.full_name || "User"}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Age</dt>
              <dd className="font-medium text-[#1a1a2e]">
                {profile?.age ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Member since</dt>
              <dd className="font-medium text-[#1a1a2e]">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  );
}
