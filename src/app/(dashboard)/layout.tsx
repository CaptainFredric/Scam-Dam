import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { CaseProvider } from "@/context/CaseContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CaseProvider>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 relative">
          {/* Subtle red ambient glow, consistent with the marketing brand */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
            <div className="absolute top-1/2 -left-24 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
          </div>
          <Header />
          <main className="flex-1 p-6 md:p-8 relative">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </CaseProvider>
  );
}
