"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, ClipboardList, Plus, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/score", label: "Score", icon: BarChart3 },
  { href: "/dashboard/plan", label: "Plan", icon: ClipboardList },
  { href: "/dashboard/apply", label: "Apply", icon: Plus, center: true },
  { href: "/dashboard/offers", label: "Offers", icon: Tag },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon, center }) => {
          const active =
            pathname === href ||
            (href === "/dashboard" && pathname === "/dashboard") ||
            (href === "/dashboard/score" && pathname.startsWith("/dashboard/score")) ||
            (href !== "/dashboard" && href !== "/dashboard/score" && pathname.startsWith(href));
          if (center) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-md">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-xs text-gray-500">{label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5",
                active ? "text-cyan-500" : "text-gray-400"
              )}
            >
              <Icon className={cn("h-6 w-6", active && "fill-cyan-500/20")} />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
