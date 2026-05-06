"use client";

import Modal from "@/components/ui/Modal";
import UpgradeButton from "./UpgradeButton";
import { CheckCircle } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  feature: string;
};

export default function UpsellModal({ open, onClose, feature }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Upgrade to unlock">
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">
          <strong>{feature}</strong> requires a paid plan. Pick what fits:
        </p>

        <div className="rounded-lg border border-red-500 bg-red-600/10 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold">Evidence Packet</span>
            <span className="text-sm text-slate-400">$19 one-time</span>
          </div>
          <p className="text-slate-400 text-xs mb-3">
            One clean export for this case. Lifetime access to that packet.
          </p>
          <ul className="text-xs text-slate-300 space-y-1 mb-3">
            <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 text-red-500" /> Watermark-free PDF</li>
            <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 text-red-500" /> CSV ledger + ZIP bundle</li>
          </ul>
          <UpgradeButton tier="packet" label="Buy Packet — $19" />
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold">Vault</span>
            <span className="text-sm text-slate-400">$8 / month</span>
          </div>
          <p className="text-slate-400 text-xs mb-3">
            Unlimited exports across all cases plus encrypted cloud sync.
          </p>
          <UpgradeButton tier="vault" label="Start Vault" />
        </div>

        <button
          onClick={onClose}
          className="w-full text-sm text-slate-400 hover:text-slate-200 py-2"
        >
          Not now
        </button>
      </div>
    </Modal>
  );
}
