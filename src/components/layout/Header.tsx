"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Cloud, HardDrive, AlertTriangle } from "lucide-react";
import { useCases } from "@/context/CaseContext";

export default function Header() {
  const router = useRouter();
  const { syncMode, syncError } = useCases();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!cancelled && user) {
            setEmail(user.email ?? null);
            return;
          }
        } catch {
          /* fall through to demo */
        }
      }
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("scamdam_demo_user");
          if (raw) {
            const parsed = JSON.parse(raw) as { email?: string };
            if (!cancelled) setEmail(parsed.email ?? null);
          }
        } catch {
          /* ignore */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        await createClient().auth.signOut();
      } catch {
        /* ignore */
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("scamdam_demo_user");
      document.cookie =
        "scamdam_demo_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SyncBadge mode={syncMode} error={syncError} />
      </div>
      <div className="flex items-center gap-4">
        {email && (
          <span className="text-sm text-slate-400 hidden sm:inline">{email}</span>
        )}
        <Link
          href="/billing"
          className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:inline"
        >
          Billing
        </Link>
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

function SyncBadge({
  mode,
  error,
}: {
  mode: "local" | "cloud" | "loading";
  error: string | null;
}) {
  if (mode === "loading") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" />
        Syncing…
      </span>
    );
  }
  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
        <AlertTriangle className="h-3.5 w-3.5" />
        Cloud sync unavailable — using local
      </span>
    );
  }
  if (mode === "cloud") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
        <Cloud className="h-3.5 w-3.5" />
        Synced to cloud
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
      <HardDrive className="h-3.5 w-3.5" />
      Local-only · stays on this device
    </span>
  );
}
