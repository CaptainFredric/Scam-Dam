import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://scamdam.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Scam Dam — Organize Your Scam Evidence. Fight Back.",
    template: "%s | Scam Dam",
  },
  description:
    "Free tool for scam victims. Build a structured evidence packet — timeline, transactions, screenshots — and export a professional PDF report ready to file with IC3, FTC, police, banks, and crypto exchanges.",
  applicationName: "Scam Dam",
  keywords: [
    "scam evidence",
    "report a scam",
    "fraud report builder",
    "IC3 report",
    "FTC complaint",
    "pig butchering evidence",
    "romance scam report",
    "crypto scam recovery",
    "task scam",
    "fake job scam",
  ],
  authors: [{ name: "Scam Dam" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Scam Dam",
    title: "Scam Dam — Organize Your Scam Evidence. Fight Back.",
    description:
      "Build a clean evidence packet in minutes. Export a professional PDF report ready to file with IC3, FTC, police, banks, and crypto exchanges.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scam Dam — Organize Your Scam Evidence",
    description:
      "Free tool for scam victims. Build a structured evidence packet and export a professional PDF report.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/favicon.ico" },
  alternates: { canonical: siteUrl },
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
