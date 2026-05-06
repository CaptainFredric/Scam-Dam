"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  CreditCard,
  LifeBuoy,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const primary = [
    { href: "/dashboard", label: "Cases", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
  ];
  const secondary = [
    { href: "/resources", label: "Scam library", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/contact", label: "Get help", icon: <LifeBuoy className="h-4 w-4" /> },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Shield className="h-6 w-6 text-red-500" />
            <div className="absolute inset-0 bg-red-500 blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Scam Dam</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-6">
        <div className="space-y-1">
          {primary.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(l.href)
                  ? "bg-red-600/20 text-red-300 border-l-2 border-red-500 -ml-px pl-[10px]"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] uppercase tracking-wider text-slate-500">
            Resources
          </div>
          <div className="space-y-1">
            {secondary.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {l.icon}
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="px-5 py-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 leading-relaxed">
          Scam Dam is an evidence tool. Not legal advice. We never sell your data.
        </p>
      </div>
    </aside>
  );
}
