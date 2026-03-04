"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, ClipboardList, Plus, Tag, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/score", label: "Score", icon: BarChart3 },
  { href: "/dashboard/plan", label: "Plan", icon: ClipboardList },
  { href: "/dashboard/apply", label: "Apply", icon: Plus },
  { href: "/dashboard/offers", label: "Offers", icon: Tag },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-56 flex-col border-r border-gray-100 bg-white shadow-sm md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-gray-100 px-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="font-semibold text-[#1a1a2e]">CreditSmart</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href === "/dashboard" && pathname === "/dashboard") ||
            (href === "/dashboard/score" && pathname.startsWith("/dashboard/score")) ||
            (href !== "/dashboard" && href !== "/dashboard/score" && pathname.startsWith(href));
          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-cyan-50 text-cyan-600" : "text-gray-600 hover:bg-gray-50 hover:text-[#1a1a2e]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
