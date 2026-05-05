import Link from "next/link";
import { Shield } from "lucide-react";

export default function SiteNav() {
  return (
    <nav className="border-b border-slate-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-500" />
          <span className="text-xl font-bold">Scam Dam</span>
        </Link>
        <div className="hidden md:flex items-center gap-5 text-sm text-slate-300">
          <Link href="/resources" className="hover:text-white">Resources</Link>
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-slate-300 hover:text-white text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
