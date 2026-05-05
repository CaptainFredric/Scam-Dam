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
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </CaseProvider>
  );
}
