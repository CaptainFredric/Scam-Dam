import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Shield className="h-7 w-7 text-red-500" />
        <span className="text-2xl font-bold text-white">Scam Dam</span>
      </Link>
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-8">
        {children}
      </div>
      <p className="mt-6 text-slate-500 text-xs text-center max-w-xs">
        ⚠️ Not legal advice. This tool helps you organize evidence for self-reporting.
      </p>
    </div>
  );
}
