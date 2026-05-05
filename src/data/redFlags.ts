import type { RedFlag } from "@/types/database";

export const redFlags: RedFlag[] = [
  // Task Scams
  {
    id: "task-1",
    label: "Too-good-to-be-true pay for simple tasks",
    description: "Promised $200–$500/day for clicking, rating, or reviewing items online.",
    scam_types: ["task_scam"],
  },
  {
    id: "task-2",
    label: "Required to pay upfront to 'unlock' earnings",
    description: "Told you must deposit crypto or cash to unlock a higher-paying task set or withdraw balance.",
    scam_types: ["task_scam"],
  },
  {
    id: "task-3",
    label: "Payment demanded in cryptocurrency only",
    description: "All payments required via USDT, Bitcoin, or other crypto — no bank transfers or PayPal.",
    scam_types: ["task_scam", "crypto_investment"],
  },
  {
    id: "task-4",
    label: "Fake review or rating platform",
    description: "Platform appears to be a legitimate e-commerce or review site but exists only to solicit funds.",
    scam_types: ["task_scam"],
  },
  {
    id: "task-5",
    label: "Commission freezes until more money is deposited",
    description: "Told your earned commission is frozen until you pay taxes, fees, or a recharge amount.",
    scam_types: ["task_scam"],
  },
  // Crypto Investment
  {
    id: "crypto-1",
    label: "Guaranteed high investment returns",
    description: "Promised fixed daily returns of 3–30% or guaranteed profits — not possible in real markets.",
    scam_types: ["crypto_investment"],
  },
  {
    id: "crypto-2",
    label: "Celebrity or influencer endorsement",
    description: "Platform claims endorsement by Elon Musk, Warren Buffett, or similar — all fake.",
    scam_types: ["crypto_investment"],
  },
  {
    id: "crypto-3",
    label: "Withdrawal blocked by 'taxes' or 'fees'",
    description: "Every withdrawal attempt requires paying additional fees, taxes, or insurance first.",
    scam_types: ["crypto_investment", "task_scam"],
  },
  {
    id: "crypto-4",
    label: "Artificial urgency and deadline pressure",
    description: "Told you must invest immediately or a 'limited' offer expires in hours.",
    scam_types: ["crypto_investment"],
  },
  {
    id: "crypto-5",
    label: "Unregistered exchange or platform",
    description: "Platform is not registered with SEC, CFTC, FinCEN, or any recognized regulator.",
    scam_types: ["crypto_investment"],
  },
  {
    id: "crypto-6",
    label: "Profits only visible on-screen, not withdrawable",
    description: "Dashboard shows large gains but any withdrawal attempt is blocked or requires more deposits.",
    scam_types: ["crypto_investment"],
  },
  // Fake Job
  {
    id: "job-1",
    label: "Hired without a real interview",
    description: "Job offered after a brief WhatsApp chat or short online form — no video interview.",
    scam_types: ["fake_job"],
  },
  {
    id: "job-2",
    label: "Pay-to-work requirement",
    description: "Required to purchase equipment, software, training, or a starter kit to begin employment.",
    scam_types: ["fake_job"],
  },
  {
    id: "job-3",
    label: "Overpayment scam via check",
    description: "Sent a check for more than agreed and asked to send back the difference.",
    scam_types: ["fake_job"],
  },
  {
    id: "job-4",
    label: "Company unverifiable or fake",
    description: "Company cannot be found in business registries, has a cloned website, or domain is very new.",
    scam_types: ["fake_job"],
  },
  {
    id: "job-5",
    label: "Job found via unsolicited message",
    description: "Offer arrived via text, WhatsApp, Telegram, or LinkedIn from someone you did not contact.",
    scam_types: ["fake_job", "task_scam"],
  },
  // Romance Scam
  {
    id: "romance-1",
    label: "Never meets in person or via live video",
    description: "Always has an excuse to avoid video calls or in-person meetings — overseas, military, oil rig.",
    scam_types: ["romance_scam"],
  },
  {
    id: "romance-2",
    label: "Claims to be foreign military or contractor",
    description: "Profile identifies as US soldier deployed overseas who needs money to return home or for medical emergency.",
    scam_types: ["romance_scam"],
  },
  {
    id: "romance-3",
    label: "Requests money or gift cards",
    description: "Eventually asks for wire transfers, gift card codes, or crypto — often framed as temporary emergency.",
    scam_types: ["romance_scam"],
  },
  {
    id: "romance-4",
    label: "Introduces crypto investment opportunity",
    description: "Romantic partner introduces you to a 'sure thing' investment platform (pig butchering combo).",
    scam_types: ["romance_scam", "crypto_investment"],
  },
  {
    id: "romance-5",
    label: "Intensely fast relationship development",
    description: "Declares love or deep connection within days or a few weeks of first contact.",
    scam_types: ["romance_scam"],
  },
  {
    id: "romance-6",
    label: "Profile photos appear to be stolen or AI-generated",
    description: "Reverse image search shows photos belong to a different person or are AI-generated.",
    scam_types: ["romance_scam"],
  },
];

export function getFlagsForScamType(scamType: string): RedFlag[] {
  return redFlags.filter((f) => f.scam_types.includes(scamType));
}
