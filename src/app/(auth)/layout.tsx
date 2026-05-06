import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full bg-red-600/10 blur-3xl" />
      </div>
      <Link href="/" className="flex items-center gap-2 mb-8 relative group">
        <div className="relative">
          <Shield className="h-7 w-7 text-red-500" />
          <div className="absolute inset-0 bg-red-500 blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">Scam Dam</span>
      </Link>
      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-8 shadow-2xl shadow-black/40">
        {children}
      </div>
      <p className="mt-6 text-slate-500 text-xs text-center max-w-xs relative">
        Not legal advice. Scam Dam helps you organize evidence for self-reporting.
      </p>
    </div>
  );
}
