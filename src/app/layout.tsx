import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scam Dam – Organize Your Scam Evidence",
  description:
    "Build a clean, structured evidence packet to report scams to IC3, FTC, police, banks, and crypto exchanges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
