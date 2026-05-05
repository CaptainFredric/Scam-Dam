"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FolderOpen, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Cases", icon: <LayoutDashboard className="h-4 w-4" /> },
  ];

  return (
    <aside className="w-56 bg-slate-800 border-r border-slate-700 flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <span className="font-bold text-white">Scam Dam</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === l.href
                ? "bg-red-600/20 text-red-400"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
          >
            {l.icon}
            {l.label}
          </Link>
        ))}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors mt-4"
        >
          <FolderOpen className="h-4 w-4" />
          New Case
        </Link>
      </nav>
      <div className="px-4 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 leading-relaxed">
          ⚠️ Not legal advice.
        </p>
      </div>
    </aside>
  );
}
