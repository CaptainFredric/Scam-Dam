"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface HeaderProps {
  userEmail?: string;
}

export default function Header({ userEmail }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("scamdam_demo_user");
      // Clear the demo cookie with matching attributes
      document.cookie =
        "scamdam_demo_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    }
    router.push("/login");
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        {userEmail && (
          <span className="text-sm text-slate-400">{userEmail}</span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}
